# Configuração do Supabase - Agenndar

Este documento detalha a configuração e uso do Supabase no projeto Agenndar.

## 🔧 Configuração Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote as credenciais:
   - Project URL
   - Anon/Public Key
   - Service Role Key (mantenha segura)

### 2. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env.local` no Git!

## 📊 Estrutura do Banco de Dados

### Ordem de Aplicação dos Scripts SQL

Os scripts SQL devem ser aplicados na seguinte ordem (veja pasta `/sql`):

1. **01_extension_uuid.sql** - Extensão UUID
2. **02_create_tables.sql** - Criação de todas as tabelas
3. **03_create_indexes.sql** - Índices para performance
4. **04_create_functions.sql** - Funções e triggers
5. **05_create_policies.sql** - Políticas RLS (Row Level Security)
6. **06_seed_data.sql** - Dados iniciais (opcional)

## 🗄️ Tabelas Principais

### `users` (Prestadores)
- Informações do prestador
- Vinculado ao Firebase Auth UID

### `clients` (Clientes Finais)
- Informações dos clientes
- Nome e telefone

### `services` (Serviços)
- Serviços oferecidos pelo prestador
- Duração e preço

### `collaborators` (Colaboradores)
- Colaboradores do prestador
- Associados a serviços

### `schedules` (Agendamentos)
- Agendamentos realizados
- Status e confirmações

### `availability` (Disponibilidade)
- Horários de trabalho
- Dias e horários disponíveis

### `financial_records` (Registros Financeiros)
- Controle financeiro
- Procedimentos e valores

## 🔐 Row Level Security (RLS)

### Políticas Implementadas

- **Prestadores**: Acessam apenas seus próprios dados
- **Clientes**: Acessam apenas seus próprios agendamentos
- **Páginas públicas**: Leitura pública de informações básicas

### Habilitar RLS

Todas as tabelas têm RLS habilitado por padrão. As políticas estão no script `05_create_policies.sql`.

## 🔄 Realtime

### Configuração

O Supabase Realtime está habilitado para:
- Tabela `schedules` - Notificações de novos agendamentos
- Tabela `availability` - Atualizações de disponibilidade

### Uso no Código

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Inscrever em mudanças
const channel = supabase
  .channel('schedules')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'schedules' },
    (payload) => {
      console.log('Novo agendamento!', payload.new)
    }
  )
  .subscribe()
```

## 📝 Funções e Triggers

### Funções Automáticas

- **Geração de slug**: Automática ao criar prestador
- **Atualização de timestamps**: `updated_at` automático
- **Validações**: Regras de negócio

### Triggers

- **Before insert**: Validações antes de inserir
- **After insert**: Ações após inserir (ex: notificações)
- **Before update**: Validações antes de atualizar

## 🔍 Índices

### Performance

Índices criados para otimizar:
- Buscas por `user_id`
- Buscas por `slug`
- Buscas por data/horário
- Buscas por status

## 🧪 Testes Locais

### Supabase CLI (Opcional)

Para desenvolvimento local com Supabase:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar projeto
supabase init

# Iniciar localmente
supabase start
```

## 📚 Documentação Adicional

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)

## 🔒 Segurança

### Boas Práticas

1. **Nunca exponha Service Role Key** no cliente
2. **Use RLS** para proteger dados
3. **Valide inputs** no servidor
4. **Use HTTPS** sempre
5. **Monitore queries** no dashboard do Supabase

### Backup

- Configure backups automáticos no Supabase
- Exporte schema regularmente
- Mantenha histórico de migrations

## 🚀 Deploy

### Vercel

As variáveis de ambiente devem ser configuradas no painel da Vercel:

1. Acesse Settings > Environment Variables
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (apenas para Server Actions)

## 📞 Suporte

Em caso de dúvidas sobre configuração do Supabase, consulte:
- Documentação oficial
- Comunidade Supabase
- Issues do projeto

