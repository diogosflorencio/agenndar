# Estrutura do Projeto - Agenndar

Este documento detalha a estrutura completa do projeto Agenndar.

## 📁 Estrutura de Diretórios

```
agenndar/
├── app/                          # App Router do Next.js 14
│   ├── globals.css              # Estilos globais e Tailwind
│   ├── layout.tsx               # Layout raiz da aplicação
│   └── page.tsx                 # Landing page
│
├── components/                   # Componentes React (a criar)
│   ├── ui/                      # Componentes de UI reutilizáveis
│   ├── layout/                  # Componentes de layout
│   └── features/                # Componentes de funcionalidades
│
├── lib/                          # Utilitários e configurações
│   ├── supabase/
│   │   └── client.ts            # Cliente Supabase
│   └── firebase/
│       └── config.ts            # Configuração Firebase
│
├── docs/                         # Documentação completa
│   ├── README.md                # Índice da documentação
│   ├── CORES.md                 # Sistema de cores
│   ├── FUNCIONALIDADES.md       # Todas as funcionalidades
│   ├── SUPABASE.md              # Configuração Supabase
│   ├── CONFIGURACOES.md         # Configurações do projeto
│   └── INSTALACAO.md             # Guia de instalação
│
├── sql/                          # Scripts SQL do Supabase
│   ├── README.md                # Ordem de aplicação
│   ├── 01_extension_uuid.sql    # Extensão UUID
│   ├── 02_create_tables.sql     # Criação de tabelas
│   ├── 03_create_indexes.sql    # Índices
│   ├── 04_create_functions.sql  # Funções e triggers
│   └── 05_create_policies.sql   # Políticas RLS
│
├── public/                       # Arquivos estáticos (a criar)
│
├── .gitignore                    # Arquivos ignorados pelo Git
├── env.example.txt               # Exemplo de variáveis de ambiente
├── ESTRUTURA.md                  # Este arquivo
├── next.config.js                # Configuração do Next.js
├── package.json                  # Dependências do projeto
├── postcss.config.js             # Configuração do PostCSS
├── README.md                     # Documentação principal
└── tailwind.config.js            # Configuração do Tailwind CSS
```

## 🎯 Arquivos Principais

### Configuração

- **package.json** - Dependências e scripts do projeto
- **next.config.js** - Configurações do Next.js
- **tailwind.config.js** - Sistema de cores e tema
- **tsconfig.json** - Configuração TypeScript
- **postcss.config.js** - Configuração PostCSS

### Aplicação

- **app/layout.tsx** - Layout raiz com metadados
- **app/page.tsx** - Landing page completa
- **app/globals.css** - Estilos globais

### Bibliotecas

- **lib/supabase/client.ts** - Cliente Supabase configurado
- **lib/firebase/config.ts** - Configuração Firebase Auth

### Documentação

- **docs/** - Toda a documentação do projeto
- **sql/** - Scripts SQL organizados
- **README.md** - Documentação principal

## 🚀 Próximas Pastas a Criar

Conforme o desenvolvimento avança, serão criadas:

```
app/
├── (auth)/                      # Rotas de autenticação
│   ├── login/
│   └── setup/
├── (public)/                    # Rotas públicas
│   └── [slug]/                  # Página pública do prestador
└── dashboard/                   # Dashboard do prestador
    ├── page.tsx
    ├── agenda/
    ├── servicos/
    ├── colaboradores/
    ├── analytics/
    └── financeiro/

components/
├── ui/                          # Componentes base
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── layout/                      # Layout components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── BottomNav.tsx
└── features/                    # Feature components
    ├── ScheduleCard.tsx
    ├── Calendar.tsx
    └── MetricsCard.tsx

public/
├── icons/                       # Ícones
└── images/                      # Imagens
```

## 📝 Convenções

### Nomenclatura de Arquivos

- **Componentes**: PascalCase (ex: `UserCard.tsx`)
- **Utilitários**: camelCase (ex: `formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_ITEMS.ts`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAuth.ts`)

### Estrutura de Componentes

```typescript
// Imports
import { ... } from '...'

// Types
interface Props { ... }

// Component
export function Component({ ... }: Props) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  return (...)
}
```

## 🔄 Fluxo de Desenvolvimento

1. **Criar componente** em `components/`
2. **Documentar** funcionalidade em `docs/`
3. **Testar** localmente
4. **Commitar** com mensagem descritiva
5. **Deploy** na Vercel (quando configurado)

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Última atualização**: 2024

