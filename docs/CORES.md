# Sistema de Cores - Agenndar

Este documento detalha todo o sistema de cores utilizado na aplicação Agenndar.

## 🎨 Paleta de Cores Principal

### Cores Primárias (Emerald/Verde)

A cor primária é o **Emerald (#10b981)**, representando crescimento, confiança e profissionalismo.

#### Escala de Cores Primárias

- `primary-50`: `#ecfdf5` - Fundo muito claro
- `primary-100`: `#d1fae5` - Fundo claro
- `primary-200`: `#a7f3d0` - Hover states claros
- `primary-300`: `#6ee7b7` - Estados interativos
- `primary-400`: `#34d399` - Destaques secundários
- `primary-500`: `#10b981` - **Cor principal (DEFAULT)**
- `primary-600`: `#059669` - Hover states
- `primary-700`: `#047857` - Estados ativos
- `primary-800`: `#065f46` - Texto em fundo claro
- `primary-900`: `#064e3b` - Contraste máximo

### Cores de Background

#### Background Dark
- `background-dark`: `#020403` - Fundo principal da aplicação (modo escuro)

#### Background App
- `app-bg`: `#0B120E` - Fundo do dashboard interno
- `surface-app-bg`: `#0B120E` - Fundo de telas internas

### Cores de Superfície

#### Superfícies Gerais
- `surface`: `#0f1c15` - Superfície padrão (cards, modais)
- `surface-light`: `#14221A` - Superfície clara (cards destacados)
- `surface-border`: `#1a2e24` - Bordas de superfícies

#### Superfícies do App (Dashboard)
- `app-surface`: `#14221A` - Superfície de cards no dashboard
- `app-border`: `#213428` - Bordas de elementos do dashboard

### Cores de Texto

- `text`: `#ffffff` - Texto principal (branco)
- `text-muted`: `#94a3b8` - Texto secundário/desabilitado
- `text-secondary`: `#cbd5e1` - Texto terciário

### Cores de Status

#### Sucesso
- `status-success`: `#10b981` - Ações bem-sucedidas, confirmações

#### Erro
- `status-error`: `#ef4444` - Erros, cancelamentos, faltas

#### Aviso
- `status-warning`: `#f59e0b` - Alertas, pendências

#### Informação
- `status-info`: `#3b82f6` - Informações, notificações

## 📱 Aplicação por Contexto

### Landing Page
- **Background**: `background-dark` (#020403)
- **Cards**: `surface` (#0f1c15)
- **Bordas**: `surface-border` (#1a2e24)
- **Texto principal**: `text` (#ffffff)
- **Texto secundário**: `text-muted` (#94a3b8)
- **CTAs**: `primary-500` (#10b981)
- **Hover CTAs**: `primary-600` (#059669)

### Dashboard (Prestador)
- **Background**: `app-bg` (#0B120E)
- **Cards**: `app-surface` (#14221A)
- **Bordas**: `app-border` (#213428)
- **Texto**: `text` (#ffffff)
- **Ícones ativos**: `primary-500` (#10b981)
- **Ícones inativos**: `text-muted` (#94a3b8)

### Página Pública (Cliente)
- **Background**: `background-dark` (#020403)
- **Cards**: `surface-light` (#14221A)
- **Bordas**: `surface-border` (#1a2e24)
- **Botões primários**: `primary-500` (#10b981)
- **Botões secundários**: `surface` (#0f1c15)

### Estados de Agendamento
- **Agendado**: `status-info` (#3b82f6)
- **Confirmado/Compareceu**: `status-success` (#10b981)
- **Faltou**: `status-error` (#ef4444)
- **Cancelado**: `status-error` (#ef4444)
- **Pendente**: `status-warning` (#f59e0b)

## 🎭 Efeitos Visuais

### Sombras (Box Shadow)

- `shadow-glow`: Efeito de brilho verde para elementos destacados
  - `0 0 20px -5px rgba(16, 185, 129, 0.3)`
  
- `shadow-glow-lg`: Efeito de brilho grande
  - `0 0 30px -5px rgba(16, 185, 129, 0.5)`

- `shadow-card`: Sombra padrão para cards
  - `0 4px 6px -1px rgba(0, 0, 0, 0.5)`

- `shadow-card-lg`: Sombra grande para cards destacados
  - `0 10px 15px -3px rgba(0, 0, 0, 0.5)`

### Gradientes

- **Gradiente primário**: `from-emerald-400 to-teal-500`
  - Usado em textos destacados e CTAs especiais

## 🔄 Modo Escuro

A aplicação é **100% dark mode**. Todas as cores foram pensadas para funcionar exclusivamente em modo escuro, garantindo:
- Redução de fadiga visual
- Economia de bateria em dispositivos OLED
- Visual moderno e profissional

## 📐 Uso no Tailwind

Todas as cores estão disponíveis no Tailwind através das classes:

```jsx
// Backgrounds
bg-background-dark
bg-app-bg
bg-surface
bg-app-surface

// Textos
text-white
text-text-muted
text-primary

// Bordas
border-surface-border
border-app-border

// Status
text-status-success
bg-status-error
```

## 🎯 Boas Práticas

1. **Sempre use as cores do sistema** - Não crie cores customizadas
2. **Mantenha contraste** - Texto sempre legível sobre fundos
3. **Use status colors** - Para feedback visual consistente
4. **Respeite hierarquia** - Cores mais claras = mais importância
5. **Teste acessibilidade** - Contraste mínimo WCAG AA

