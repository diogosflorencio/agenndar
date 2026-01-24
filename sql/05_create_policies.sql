-- ============================================
-- 05_create_policies.sql
-- ============================================
-- Políticas RLS (Row Level Security)
-- ORDEM DE APLICAÇÃO: 5
-- IMPORTANTE: Execute após criar todas as tabelas e funções
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA USERS (Prestadores)
-- ============================================

-- Prestadores podem ver seus próprios dados
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid()::text = firebase_uid);

-- Prestadores podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid()::text = firebase_uid);

-- Prestadores podem inserir seus próprios dados
CREATE POLICY "Users can insert own data"
    ON users FOR INSERT
    WITH CHECK (auth.uid()::text = firebase_uid);

-- Público pode ver dados básicos (para página pública)
CREATE POLICY "Public can view user basic data"
    ON users FOR SELECT
    USING (true); -- Todos podem ver nome do negócio e slug

-- ============================================
-- POLÍTICAS PARA CLIENTS
-- ============================================

-- Clientes podem ver seus próprios dados
CREATE POLICY "Clients can view own data"
    ON clients FOR SELECT
    USING (auth.uid()::text = firebase_uid);

-- Clientes podem atualizar seus próprios dados
CREATE POLICY "Clients can update own data"
    ON clients FOR UPDATE
    USING (auth.uid()::text = firebase_uid);

-- Clientes podem inserir seus próprios dados
CREATE POLICY "Clients can insert own data"
    ON clients FOR INSERT
    WITH CHECK (auth.uid()::text = firebase_uid);

-- Prestadores podem ver clientes que agendaram com eles
CREATE POLICY "Users can view their clients"
    ON clients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM schedules
            WHERE schedules.client_id = clients.id
            AND schedules.user_id IN (
                SELECT id FROM users WHERE firebase_uid = auth.uid()::text
            )
        )
    );

-- ============================================
-- POLÍTICAS PARA COLLABORATORS
-- ============================================

-- Prestadores podem gerenciar seus colaboradores
CREATE POLICY "Users can manage own collaborators"
    ON collaborators FOR ALL
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Público pode ver colaboradores ativos (para página pública)
CREATE POLICY "Public can view active collaborators"
    ON collaborators FOR SELECT
    USING (is_active = true);

-- ============================================
-- POLÍTICAS PARA SERVICES
-- ============================================

-- Prestadores podem gerenciar seus serviços
CREATE POLICY "Users can manage own services"
    ON services FOR ALL
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Público pode ver serviços ativos (para página pública)
CREATE POLICY "Public can view active services"
    ON services FOR SELECT
    USING (is_active = true);

-- ============================================
-- POLÍTICAS PARA SERVICE_COLLABORATORS
-- ============================================

-- Prestadores podem gerenciar associações
CREATE POLICY "Users can manage service collaborators"
    ON service_collaborators FOR ALL
    USING (
        service_id IN (
            SELECT id FROM services
            WHERE user_id IN (
                SELECT id FROM users WHERE firebase_uid = auth.uid()::text
            )
        )
    );

-- Público pode ver associações (para página pública)
CREATE POLICY "Public can view service collaborators"
    ON service_collaborators FOR SELECT
    USING (true);

-- ============================================
-- POLÍTICAS PARA AVAILABILITY
-- ============================================

-- Prestadores podem gerenciar sua disponibilidade
CREATE POLICY "Users can manage own availability"
    ON availability FOR ALL
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Público pode ver disponibilidade (para página pública)
CREATE POLICY "Public can view availability"
    ON availability FOR SELECT
    USING (is_available = true);

-- ============================================
-- POLÍTICAS PARA AVAILABILITY_OVERRIDES
-- ============================================

-- Prestadores podem gerenciar overrides
CREATE POLICY "Users can manage own availability overrides"
    ON availability_overrides FOR ALL
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Público pode ver overrides (para página pública)
CREATE POLICY "Public can view availability overrides"
    ON availability_overrides FOR SELECT
    USING (is_available = true);

-- ============================================
-- POLÍTICAS PARA BREAK_PERIODS
-- ============================================

-- Prestadores podem gerenciar períodos de descanso
CREATE POLICY "Users can manage own break periods"
    ON break_periods FOR ALL
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Público pode ver períodos de descanso (para página pública)
CREATE POLICY "Public can view break periods"
    ON break_periods FOR SELECT
    USING (true);

-- ============================================
-- POLÍTICAS PARA SCHEDULES
-- ============================================

-- Prestadores podem gerenciar seus agendamentos
CREATE POLICY "Users can manage own schedules"
    ON schedules FOR ALL
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Clientes podem ver seus próprios agendamentos
CREATE POLICY "Clients can view own schedules"
    ON schedules FOR SELECT
    USING (
        client_id IN (
            SELECT id FROM clients WHERE firebase_uid = auth.uid()::text
        )
    );

-- Clientes podem criar agendamentos
CREATE POLICY "Clients can create schedules"
    ON schedules FOR INSERT
    WITH CHECK (
        client_id IN (
            SELECT id FROM clients WHERE firebase_uid = auth.uid()::text
        )
    );

-- Clientes podem atualizar seus próprios agendamentos (cancelar, remarcar)
CREATE POLICY "Clients can update own schedules"
    ON schedules FOR UPDATE
    USING (
        client_id IN (
            SELECT id FROM clients WHERE firebase_uid = auth.uid()::text
        )
    );

-- ============================================
-- POLÍTICAS PARA FINANCIAL_RECORDS
-- ============================================

-- Prestadores podem ver seus registros financeiros
CREATE POLICY "Users can view own financial records"
    ON financial_records FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Prestadores podem criar registros financeiros
CREATE POLICY "Users can create financial records"
    ON financial_records FOR INSERT
    WITH CHECK (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Prestadores podem atualizar seus registros financeiros
CREATE POLICY "Users can update own financial records"
    ON financial_records FOR UPDATE
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- ============================================
-- POLÍTICAS PARA NOTIFICATIONS
-- ============================================

-- Prestadores podem ver suas notificações
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Clientes podem ver suas notificações
CREATE POLICY "Clients can view own notifications"
    ON notifications FOR SELECT
    USING (
        client_id IN (
            SELECT id FROM clients WHERE firebase_uid = auth.uid()::text
        )
    );

-- Sistema pode criar notificações (via service role)
-- Nota: Isso requer service role key, não anon key

-- Prestadores podem atualizar suas notificações (marcar como lida)
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

-- Clientes podem atualizar suas notificações (marcar como lida)
CREATE POLICY "Clients can update own notifications"
    ON notifications FOR UPDATE
    USING (
        client_id IN (
            SELECT id FROM clients WHERE firebase_uid = auth.uid()::text
        )
    );

-- ============================================
-- POLÍTICAS PARA USER_SETTINGS
-- ============================================

-- Prestadores podem gerenciar suas configurações
CREATE POLICY "Users can manage own settings"
    ON user_settings FOR ALL
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );

