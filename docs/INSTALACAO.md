# Guia de Instalação - Agenndar

Este guia detalha passo a passo como configurar o projeto Agenndar do zero.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Git** ([Download](https://git-scm.com/))
- Conta no **Supabase** ([Criar conta](https://supabase.com))
- Conta no **Firebase** ([Criar conta](https://firebase.google.com))

## 🚀 Passo a Passo

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd agenndar
```

### 2. Instalar Dependências

```bash
npm install
```

ou

```bash
yarn install
```

### 3. Configurar Supabase

#### 3.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Preencha:
   - Nome do projeto
   - Senha do banco de dados
   - Região (escolha a mais próxima)
5. Aguarde a criação do projeto (pode levar alguns minutos)

#### 3.2 Obter Credenciais do Supabase

1. No dashboard do Supabase, vá em **Settings** > **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave pública)
   - **service_role key** (chave de serviço - mantenha segura!)

#### 3.3 Aplicar Scripts SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Execute os scripts na ordem (veja `sql/README.md`):
   - `01_extension_uuid.sql`
   - `02_create_tables.sql`
   - `03_create_indexes.sql`
   - `04_create_functions.sql`
   - `05_create_policies.sql`

### 4. Configurar Firebase

#### 4.1 Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Add project"
3. Preencha o nome do projeto
4. Configure Google Analytics (opcional)
5. Aguarde a criação

#### 4.2 Configurar Authentication

1. No Firebase Console, vá em **Authentication**
2. Clique em "Get started"
3. Habilite **Google** como método de login
4. Configure:
   - Nome do projeto público
   - Email de suporte
   - Domínios autorizados (adicione seu domínio)

#### 4.3 Obter Credenciais do Firebase

1. No Firebase Console, vá em **Project Settings** (ícone de engrenagem)
2. Role até "Your apps"
3. Clique em **Web** (ícone `</>`)
4. Registre o app com um nome
5. Copie as credenciais do objeto `firebaseConfig`

### 5. Configurar Variáveis de Ambiente

1. Copie o arquivo `env.example.txt` para `.env.local`:

```bash
cp env.example.txt .env.local
```

2. Abra `.env.local` e preencha com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env.local` no Git!

### 6. Executar o Projeto

```bash
npm run dev
```

ou

```bash
yarn dev
```

O projeto estará disponível em: **http://localhost:3000**

## ✅ Verificação

Após seguir todos os passos, verifique:

- [ ] Projeto inicia sem erros
- [ ] Landing page carrega corretamente
- [ ] Conexão com Supabase funcionando
- [ ] Firebase Auth configurado
- [ ] Todas as variáveis de ambiente preenchidas

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"

- Verifique se o arquivo `.env.local` existe
- Verifique se todas as variáveis estão preenchidas
- Reinicie o servidor de desenvolvimento

### Erro: "Missing Firebase environment variables"

- Verifique se todas as credenciais do Firebase estão corretas
- Certifique-se de que copiou todas as variáveis do `firebaseConfig`

### Erro ao executar scripts SQL

- Verifique se está executando na ordem correta
- Certifique-se de que não há erros de sintaxe
- Verifique os logs no dashboard do Supabase

### Erro de conexão com Supabase

- Verifique se a URL está correta
- Verifique se a chave anon está correta
- Verifique se o projeto está ativo no Supabase

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. Leia a documentação em `/docs`
2. Configure as políticas RLS no Supabase
3. Teste o fluxo de autenticação
4. Comece a desenvolver novas funcionalidades

## 📞 Suporte

Em caso de problemas:

1. Consulte a documentação em `/docs`
2. Verifique os logs do console
3. Verifique os logs do Supabase e Firebase
4. Abra uma issue no repositório (se aplicável)

## 🎉 Pronto!

Seu ambiente está configurado e pronto para desenvolvimento!

