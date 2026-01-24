-- ============================================
-- 01_extension_uuid.sql
-- ============================================
-- Extensão para geração de UUIDs
-- ORDEM DE APLICAÇÃO: 1
-- ============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar se a extensão foi criada
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

