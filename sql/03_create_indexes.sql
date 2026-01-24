-- ============================================
-- 03_create_indexes.sql
-- ============================================
-- Índices para otimização de queries
-- ORDEM DE APLICAÇÃO: 3
-- ============================================

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_slug ON users(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Índices para clients
CREATE INDEX IF NOT EXISTS idx_clients_firebase_uid ON clients(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);

-- Índices para collaborators
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_is_active ON collaborators(is_active);

-- Índices para services
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

-- Índices para service_collaborators
CREATE INDEX IF NOT EXISTS idx_service_collaborators_service_id ON service_collaborators(service_id);
CREATE INDEX IF NOT EXISTS idx_service_collaborators_collaborator_id ON service_collaborators(collaborator_id);

-- Índices para availability
CREATE INDEX IF NOT EXISTS idx_availability_user_id ON availability(user_id);
CREATE INDEX IF NOT EXISTS idx_availability_day_of_week ON availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_is_available ON availability(is_available);

-- Índices para availability_overrides
CREATE INDEX IF NOT EXISTS idx_availability_overrides_user_id ON availability_overrides(user_id);
CREATE INDEX IF NOT EXISTS idx_availability_overrides_date ON availability_overrides(date);

-- Índices para break_periods
CREATE INDEX IF NOT EXISTS idx_break_periods_user_id ON break_periods(user_id);
CREATE INDEX IF NOT EXISTS idx_break_periods_day_of_week ON break_periods(day_of_week);
CREATE INDEX IF NOT EXISTS idx_break_periods_date ON break_periods(date);

-- Índices para schedules (mais importantes para performance)
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_client_id ON schedules(client_id);
CREATE INDEX IF NOT EXISTS idx_schedules_service_id ON schedules(service_id);
CREATE INDEX IF NOT EXISTS idx_schedules_collaborator_id ON schedules(collaborator_id);
CREATE INDEX IF NOT EXISTS idx_schedules_scheduled_date ON schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules(status);
CREATE INDEX IF NOT EXISTS idx_schedules_date_time ON schedules(scheduled_date, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_schedules_user_date ON schedules(user_id, scheduled_date);

-- Índices para financial_records
CREATE INDEX IF NOT EXISTS idx_financial_records_user_id ON financial_records(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_client_id ON financial_records(client_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_schedule_id ON financial_records(schedule_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_record_date ON financial_records(record_date);
CREATE INDEX IF NOT EXISTS idx_financial_records_record_type ON financial_records(record_type);
CREATE INDEX IF NOT EXISTS idx_financial_records_user_date ON financial_records(user_id, record_date);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_client_id ON notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- Índices para user_settings
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

