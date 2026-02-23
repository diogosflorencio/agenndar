# Auth, mock e deploy

## Tema

- **Global (landing, login, página pública)**: verde escuro (`--global-bg`, `#020403`).
- **Dashboard**: tema claro (`--dash-bg`, `--dash-surface`, etc.) aplicado em todas as páginas sob `/dashboard`.

## Auth (Supabase)

- **Login**: `/login` — botão "Entrar com Google" (OAuth) e formulário "Acesso demo" (e-mail/senha).
- **Callback**: após o Google, o usuário volta em `/auth/callback?next=...`; a sessão é restaurada (PKCE) e o usuário é redirecionado para `next` ou `/setup` se ainda não existir em `users`.
- **Proteção**: o layout de `/dashboard` verifica `supabase.auth.getUser()`; se não houver sessão, redireciona para `/login?next=/dashboard`.
- **Sync com DB**: `users.firebase_uid` = `auth.user.id` (Supabase Auth). O onboarding em `/setup` cria/atualiza o registro em `users` após o login.

## Mock para testar

### 1) Usuário demo (login e dashboard)

1. No **Supabase Dashboard** → **Authentication** → **Users** → **Add user** → **Create new user**:
   - E-mail: `demo@agenndar.com`
   - Senha: `demo123`
2. Copie o **UID** do usuário criado.
3. Abra **SQL Editor** e execute o script `sql/08_seed_demo.sql` **trocando** `REPLACE_WITH_AUTH_UID` pelo UID copiado.
4. Acesse `/login`, use "Acesso demo" com `demo@agenndar.com` / `demo123`. Você será redirecionado ao dashboard.

### 2) Página pública de agendamento (mock)

- Depois de rodar o seed acima, o slug `demo` fica cadastrado.
- Acesse **`/demo`** (ou o link "Ver Demo" na landing) para ver a página de agendamento com serviços e colaboradores do usuário demo.
- Para agendar, use "Entrar com Google" (ou outro cliente em `clients`); o fluxo é o mesmo da página pública real.

## Deploy (Vercel)

1. Conecte o repositório ao Vercel.
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. No Supabase → **Authentication** → **URL Configuration**:
   - **Site URL**: `https://seu-dominio.vercel.app`
   - **Redirect URLs**: inclua `https://seu-dominio.vercel.app/auth/callback`, `https://seu-dominio.vercel.app/**`
4. Faça o deploy. O build pode falhar com EPERM em `.next/trace` em alguns ambientes Windows; nesse caso, rode `npm run build` em outro ambiente (WSL, CI ou máquina local com permissões corretas).

## Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Landing (tema verde escuro) |
| `/login` | Login Google + demo (e-mail/senha) |
| `/auth/callback` | Callback OAuth; redireciona para `next` ou `/setup` |
| `/setup` | Onboarding (4 passos); requer auth |
| `/dashboard` | Dashboard (tema claro); requer auth + user em DB |
| `/dashboard/conta` | Personalização (conta, QR, link público) |
| `/dashboard/servicos` | CRUD serviços |
| `/dashboard/colaboradores` | Lista e gestão de colaboradores |
| `/[slug]` | Página pública de agendamento (ex.: `/demo`) |
