# Documentação - Agenndar

Bem-vindo à documentação completa do projeto Agenndar. Este diretório contém toda a documentação necessária para entender, configurar e desenvolver o sistema.

## 📚 Índice da Documentação

### 🎨 Design e UI

- **[CORES.md](./CORES.md)** - Sistema completo de cores
  - Paleta de cores principal
  - Cores de background e superfície
  - Cores de texto e status
  - Aplicação por contexto
  - Efeitos visuais e gradientes

### ⚙️ Configuração

- **[CONFIGURACOES.md](./CONFIGURACOES.md)** - Configurações do projeto
  - Stack tecnológica
  - Variáveis de ambiente
  - Estrutura de pastas
  - Configurações do Next.js
  - Convenções de código

- **[INSTALACAO.md](./INSTALACAO.md)** - Guia de instalação passo a passo
  - Pré-requisitos
  - Configuração do Supabase
  - Configuração do Firebase
  - Variáveis de ambiente
  - Troubleshooting

- **[SUPABASE.md](./SUPABASE.md)** - Configuração e uso do Supabase
  - Configuração inicial
  - Estrutura do banco de dados
  - Row Level Security (RLS)
  - Realtime
  - Funções e triggers
  - Segurança

### 🚀 Funcionalidades

- **[FUNCIONALIDADES.md](./FUNCIONALIDADES.md)** - Todas as funcionalidades do sistema
  - Autenticação
  - Dashboard do prestador
  - Agenda e disponibilidade
  - Colaboradores e serviços
  - Analytics e financeiro
  - Página pública
  - Agendamentos
  - Notificações
  - PWA e QR Code

## 🗄️ SQL e Banco de Dados

Consulte a pasta `/sql` para scripts SQL:

- **[sql/README.md](../sql/README.md)** - Ordem de aplicação dos scripts
- **01_extension_uuid.sql** - Extensão UUID
- **02_create_tables.sql** - Criação de tabelas
- **03_create_indexes.sql** - Índices
- **04_create_functions.sql** - Funções e triggers
- **05_create_policies.sql** - Políticas RLS

## 🎯 Início Rápido

1. **Novo no projeto?** Comece por [INSTALACAO.md](./INSTALACAO.md)
2. **Quer entender as funcionalidades?** Leia [FUNCIONALIDADES.md](./FUNCIONALIDADES.md)
3. **Precisa configurar o banco?** Veja [SUPABASE.md](./SUPABASE.md) e `/sql`
4. **Trabalhando com UI?** Consulte [CORES.md](./CORES.md)

## 📝 Convenções

- Toda funcionalidade deve ter documentação
- Regras de negócio devem estar documentadas
- Mudanças significativas devem atualizar a documentação
- Use português em toda a documentação

## 🔄 Atualizações

A documentação é atualizada conforme o projeto evolui. Sempre consulte a versão mais recente.

## 📞 Dúvidas?

- Consulte a documentação específica
- Verifique os exemplos de código
- Consulte os comentários no código
- Abra uma issue se necessário

---

**Última atualização**: 2024

