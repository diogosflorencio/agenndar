-- ============================================
-- 07_create_onboarding_table.sql
-- ============================================
-- Tabela para armazenar dados do onboarding
-- ORDEM DE APLICAÇÃO: 7 (após todas as outras)
-- ============================================

-- Tabela de dados de onboarding
CREATE TABLE IF NOT EXISTS user_onboarding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_size TEXT CHECK (team_size IN ('1', '2-5', '5+')),
    daily_appointments INTEGER,
    average_ticket DECIMAL(10, 2),
    recommended_plan TEXT CHECK (recommended_plan IN ('starter', 'growth', 'enterprise')),
    recommended_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);

-- Trigger para updated_at
CREATE TRIGGER update_user_onboarding_updated_at BEFORE UPDATE ON user_onboarding
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Política RLS
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own onboarding data"
    ON user_onboarding FOR ALL
    USING (
        user_id IN (
            SELECT id FROM users WHERE firebase_uid = auth.uid()::text
        )
    );


