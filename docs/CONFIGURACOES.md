# Configurações do Projeto - Agenndar

Este documento detalha todas as configurações do projeto Agenndar.

## 📦 Versão

- **Nome**: Agenndar
- **Versão**: 1.0.0
- **Tipo**: SaaS de Agendamento

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js**: 14.2.0
- **React**: 18.3.0
- **TypeScript**: 5.3.0
- **Tailwind CSS**: 3.4.0

### Backend
- **Next.js API Routes**: Server Actions
- **Supabase**: Banco de dados e Realtime
- **Firebase Auth**: Autenticação

### Hospedagem
- **Vercel**: Produção
- **Domínio**: agendex.com.br (configurar)

## 🔐 Variáveis de Ambiente

### Obrigatórias

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

### Opcionais

```env
# Analytics (futuro)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (futuro)
NEXT_PUBLIC_SENTRY_DSN=https://...
```

## 📁 Estrutura de Pastas

```
agenndar/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Rotas de autenticação
│   ├── (public)/          # Rotas públicas
│   ├── dashboard/         # Dashboard do prestador
│   └── [slug]/            # Página pública do prestador
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI
│   ├── layout/           # Componentes de layout
│   └── features/         # Componentes de funcionalidades
├── lib/                  # Utilitários
│   ├── supabase/        # Cliente Supabase
│   ├── firebase/        # Configuração Firebase
│   └── utils/           # Funções utilitárias
├── docs/                # Documentação
├── sql/                 # Scripts SQL
└── public/              # Arquivos estáticos
```

## 🎨 Configurações de Estilo

### Tailwind CSS

- **Modo escuro**: Sempre ativo (class)
- **Fontes**: Inter (Google Fonts)
- **Cores**: Sistema customizado (ver `CORES.md`)

### Material Symbols

- **Fonte**: Material Symbols Outlined
- **Variation Settings**: FILL 1, wght 400

## 📱 PWA

### Configuração (Futuro)

- **Manifest**: `/public/manifest.json`
- **Service Worker**: Configurado via Next.js
- **Ícones**: Múltiplos tamanhos para diferentes dispositivos

## 🔄 Configurações do Next.js

### next.config.js

```javascript
{
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}
```

### TypeScript

- **Strict mode**: Ativado
- **Paths**: `@/*` aponta para raiz
- **Target**: ES2020

## 🌐 Domínio e URLs

### Produção
- **Domínio principal**: agendex.com.br
- **Páginas públicas**: agendex.com.br/{slug}
- **Dashboard**: agendex.com.br/dashboard

### Desenvolvimento
- **Local**: localhost:3000
- **Vercel Preview**: {branch}.vercel.app

## 📊 Analytics e Monitoramento

### Métricas (Futuro)
- Google Analytics
- Vercel Analytics
- Sentry (erros)

## 🔔 Notificações

### Push Notifications
- **PWA**: Quando instalado
- **Internas**: Sempre disponíveis
- **Não usa**: WhatsApp API (evita custos)

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linter
npm run lint
```

## 📝 Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (ex: `UserCard.tsx`)
- **Arquivos**: kebab-case (ex: `user-card.tsx`)
- **Funções**: camelCase (ex: `getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_APPOINTMENTS`)

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

## 🔒 Segurança

### Headers de Segurança
- Configurados via `next.config.js`
- HTTPS obrigatório em produção

### Validação
- **Client**: Zod + React Hook Form
- **Server**: Validação dupla

## 📦 Dependências Principais

### Produção
- `next`, `react`, `react-dom`
- `@supabase/supabase-js`
- `firebase`
- `date-fns`
- `zod`, `react-hook-form`

### Desenvolvimento
- `typescript`
- `tailwindcss`
- `eslint`

## 🔄 Versionamento

### Semântico
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades
- **PATCH**: Correções

### Changelog
- Manter `CHANGELOG.md` atualizado
- Documentar breaking changes

## 📞 Suporte e Contato

- **Documentação**: `/docs`
- **Issues**: GitHub (se aplicável)
- **Email**: (configurar)

## 🎯 Próximas Configurações

- [ ] PWA completo
- [ ] Analytics
- [ ] Sentry
- [ ] Testes automatizados
- [ ] CI/CD completo

