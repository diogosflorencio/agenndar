-- ============================================
-- 04_create_functions.sql
-- ============================================
-- Funções e triggers do sistema
-- ORDEM DE APLICAÇÃO: 4
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at em todas as tabelas
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaborators_updated_at BEFORE UPDATE ON collaborators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_overrides_updated_at BEFORE UPDATE ON availability_overrides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_break_periods_updated_at BEFORE UPDATE ON break_periods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_records_updated_at BEFORE UPDATE ON financial_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_unique_slug(business_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Normalizar nome: minúsculas, remover acentos, substituir espaços por hífens
    base_slug := lower(trim(business_name));
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := regexp_replace(base_slug, '^-|-$', '', 'g');
    
    final_slug := base_slug;
    
    -- Verificar se já existe, se sim, adicionar número
    WHILE EXISTS (SELECT 1 FROM users WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Função para criar registro financeiro ao confirmar agendamento
CREATE OR REPLACE FUNCTION create_financial_record_on_confirm()
RETURNS TRIGGER AS $$
BEGIN
    -- Se status mudou para 'compareceu', criar registro financeiro
    IF NEW.status = 'compareceu' AND (OLD.status IS NULL OR OLD.status != 'compareceu') THEN
        INSERT INTO financial_records (
            user_id,
            client_id,
            schedule_id,
            service_id,
            collaborator_id,
            amount,
            record_type,
            record_date
        )
        SELECT
            NEW.user_id,
            NEW.client_id,
            NEW.id,
            NEW.service_id,
            NEW.collaborator_id,
            COALESCE(s.price, 0),
            'confirmado',
            NEW.scheduled_date
        FROM services s
        WHERE s.id = NEW.service_id;
        
        -- Atualizar confirmed_at
        NEW.confirmed_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar registro financeiro ao confirmar
CREATE TRIGGER trigger_create_financial_on_confirm
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    WHEN (NEW.status = 'compareceu' AND (OLD.status IS NULL OR OLD.status != 'compareceu'))
    EXECUTE FUNCTION create_financial_record_on_confirm();

-- Função para criar notificação ao criar agendamento
CREATE OR REPLACE FUNCTION notify_new_schedule()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificar o prestador
    INSERT INTO notifications (
        user_id,
        client_id,
        type,
        title,
        message,
        related_schedule_id
    )
    VALUES (
        NEW.user_id,
        NEW.client_id,
        'novo_agendamento',
        'Novo Agendamento',
        'Um novo agendamento foi criado para ' || NEW.scheduled_date || ' às ' || NEW.scheduled_time,
        NEW.id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar novo agendamento
CREATE TRIGGER trigger_notify_new_schedule
    AFTER INSERT ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_schedule();

-- Função para criar notificação ao cancelar agendamento
CREATE OR REPLACE FUNCTION notify_cancel_schedule()
RETURNS TRIGGER AS $$
BEGIN
    -- Se foi cancelado, notificar ambos
    IF NEW.status = 'cancelado' AND (OLD.status IS NULL OR OLD.status != 'cancelado') THEN
        -- Notificar prestador
        INSERT INTO notifications (
            user_id,
            client_id,
            type,
            title,
            message,
            related_schedule_id
        )
        VALUES (
            NEW.user_id,
            NEW.client_id,
            'cancelamento',
            'Agendamento Cancelado',
            'Um agendamento foi cancelado para ' || NEW.scheduled_date || ' às ' || NEW.scheduled_time,
            NEW.id
        );
        
        -- Notificar cliente (se tiver user_id)
        IF EXISTS (SELECT 1 FROM clients WHERE id = NEW.client_id AND firebase_uid IS NOT NULL) THEN
            INSERT INTO notifications (
                client_id,
                type,
                title,
                message,
                related_schedule_id
            )
            SELECT
                NEW.client_id,
                'cancelamento',
                'Agendamento Cancelado',
                'Seu agendamento para ' || NEW.scheduled_date || ' às ' || NEW.scheduled_time || ' foi cancelado',
                NEW.id;
        END IF;
        
        NEW.canceled_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar cancelamento
CREATE TRIGGER trigger_notify_cancel_schedule
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    WHEN (NEW.status = 'cancelado' AND (OLD.status IS NULL OR OLD.status != 'cancelado'))
    EXECUTE FUNCTION notify_cancel_schedule();

-- Função para criar settings padrão ao criar usuário
CREATE OR REPLACE FUNCTION create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar settings padrão
CREATE TRIGGER trigger_create_default_settings
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_settings();

