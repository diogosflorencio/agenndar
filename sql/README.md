# Scripts SQL do Supabase - Agenndar

Este diretório contém todos os scripts SQL necessários para configurar o banco de dados do Supabase.

## ⚠️ ORDEM DE APLICAÇÃO OBRIGATÓRIA

Os scripts **DEVEM** ser aplicados na seguinte ordem:

1. **01_extension_uuid.sql** - Extensão UUID
2. **02_create_tables.sql** - Criação de todas as tabelas
3. **03_create_indexes.sql** - Índices para performance
4. **04_create_functions.sql** - Funções e triggers
5. **05_create_policies.sql** - Políticas RLS (Row Level Security)
6. **07_create_onboarding_table.sql** - Tabela de dados de onboarding (opcional, mas recomendado)

## 📋 Como Aplicar

### Via Dashboard do Supabase

1. Acesse o dashboard do seu projeto no Supabase
2. Vá em **SQL Editor**
3. Execute cada script na ordem acima
4. Verifique se não há erros

### Via Supabase CLI

```bash
# Se estiver usando Supabase CLI localmente
supabase db reset
psql -h localhost -U postgres -d postgres -f sql/01_extension_uuid.sql
psql -h localhost -U postgres -d postgres -f sql/02_create_tables.sql
psql -h localhost -U postgres -d postgres -f sql/03_create_indexes.sql
psql -h localhost -U postgres -d postgres -f sql/04_create_functions.sql
psql -h localhost -U postgres -d postgres -f sql/05_create_policies.sql
```

## 📊 Estrutura do Banco

### Tabelas Principais

- **users** - Prestadores de serviço
- **clients** - Clientes finais
- **collaborators** - Colaboradores dos prestadores
- **services** - Serviços oferecidos
- **schedules** - Agendamentos
- **availability** - Disponibilidade padrão
- **availability_overrides** - Disponibilidade específica por data
- **break_periods** - Períodos de descanso
- **financial_records** - Registros financeiros
- **notifications** - Notificações do sistema
- **user_settings** - Configurações do usuário

## 🔐 Segurança

- Todas as tabelas têm **RLS (Row Level Security)** habilitado
- Políticas garantem que usuários só acessem seus próprios dados
- Páginas públicas têm acesso limitado a dados básicos

## 🔄 Migrations Futuras

Para adicionar novas migrations:

1. Crie um novo arquivo numerado (ex: `06_nova_migration.sql`)
2. Documente no README
3. Atualize a ordem de aplicação se necessário

## ⚠️ Atenção

- **Nunca** execute scripts fora de ordem
- **Sempre** faça backup antes de aplicar em produção
- **Teste** primeiro em ambiente de desenvolvimento
- **Verifique** se todas as políticas RLS estão funcionando

## 🐛 Troubleshooting

### Erro: "relation already exists"
- Algumas tabelas já existem
- Execute `DROP TABLE` se necessário (cuidado em produção!)

### Erro: "permission denied"
- Verifique se está usando a service role key para operações administrativas
- RLS pode estar bloqueando - verifique as políticas

### Erro: "function does not exist"
- Certifique-se de que executou `04_create_functions.sql` antes de `05_create_policies.sql`

## 📞 Suporte

Em caso de problemas, consulte:
- Documentação do Supabase
- Arquivo `docs/SUPABASE.md`
- Logs do Supabase Dashboard

