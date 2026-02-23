-- ============================================
-- 08_seed_demo.sql
-- ============================================
-- Mock para teste: página pública /demo e login demo
--
-- PASSO 1: No Supabase Dashboard > Authentication > Users, crie um usuário:
--   E-mail: demo@agenndar.com
--   Senha: demo123
--   (ou use "Add user" e defina a senha)
--
-- PASSO 2: Copie o UID do usuário criado (coluna "UID" na tabela auth.users)
--
-- PASSO 3: Substitua abaixo REPLACE_WITH_AUTH_UID pelo UID copiado e execute
--          este script no SQL Editor do Supabase.
-- ============================================

-- Substitua pelo UID do usuário demo criado no Auth
DO $$
DECLARE
  demo_uid TEXT := 'REPLACE_WITH_AUTH_UID';
  v_user_id UUID;
  v_collab1_id UUID;
  v_collab2_id UUID;
  v_service1_id UUID;
  v_service2_id UUID;
BEGIN
  IF demo_uid = 'REPLACE_WITH_AUTH_UID' THEN
    RAISE NOTICE 'Substitua REPLACE_WITH_AUTH_UID pelo UID do usuário criado no Supabase Auth e execute novamente.';
    RETURN;
  END IF;

  INSERT INTO users (firebase_uid, email, business_name, phone, slug)
  VALUES (demo_uid, 'demo@agenndar.com', 'Barbearia Demo', '11999999999', 'demo')
  ON CONFLICT (firebase_uid) DO UPDATE SET
    email = EXCLUDED.email,
    business_name = EXCLUDED.business_name,
    phone = EXCLUDED.phone,
    slug = EXCLUDED.slug
  RETURNING id INTO v_user_id;

  INSERT INTO services (user_id, name, duration_minutes, price, is_active)
  VALUES
    (v_user_id, 'Corte Masculino', 45, 65.00, true),
    (v_user_id, 'Barba Completa', 30, 45.00, true);

  SELECT id INTO v_service1_id FROM services WHERE user_id = v_user_id AND name = 'Corte Masculino' LIMIT 1;
  SELECT id INTO v_service2_id FROM services WHERE user_id = v_user_id AND name = 'Barba Completa' LIMIT 1;

  INSERT INTO collaborators (user_id, name, phone, is_active)
  VALUES
    (v_user_id, 'Ricardo', '11987654321', true),
    (v_user_id, 'Marcos', '11976543210', true);

  SELECT id INTO v_collab1_id FROM collaborators WHERE user_id = v_user_id AND name = 'Ricardo' LIMIT 1;
  SELECT id INTO v_collab2_id FROM collaborators WHERE user_id = v_user_id AND name = 'Marcos' LIMIT 1;

  IF v_service1_id IS NOT NULL AND v_collab1_id IS NOT NULL THEN
    INSERT INTO service_collaborators (service_id, collaborator_id)
    VALUES (v_service1_id, v_collab1_id), (v_service1_id, v_collab2_id)
    ON CONFLICT (service_id, collaborator_id) DO NOTHING;
  END IF;
  IF v_service2_id IS NOT NULL AND v_collab1_id IS NOT NULL THEN
    INSERT INTO service_collaborators (service_id, collaborator_id)
    VALUES (v_service2_id, v_collab1_id), (v_service2_id, v_collab2_id)
    ON CONFLICT (service_id, collaborator_id) DO NOTHING;
  END IF;

  -- Disponibilidade padrão: Seg a Sáb 9h-18h
  INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_available)
  SELECT v_user_id, d, '09:00'::time, '18:00'::time, true
  FROM generate_series(1, 6) AS d
  ON CONFLICT (user_id, day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_available = true;

  RAISE NOTICE 'Seed demo concluído. Acesse /demo para a página pública e use demo@agenndar.com / demo123 para login.';
END $$;
