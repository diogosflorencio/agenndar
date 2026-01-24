# Bibliotecas Utilizadas - Agenndar

Este documento detalha todas as bibliotecas utilizadas no projeto e suas finalidades.

## 📦 Dependências Principais

### Framework e Core
- **next** (^14.2.0) - Framework React para produção
- **react** (^18.3.0) - Biblioteca React
- **react-dom** (^18.3.0) - Renderização React para DOM

### Banco de Dados e Backend
- **@supabase/supabase-js** (^2.39.0) - Cliente JavaScript do Supabase
- **@supabase/realtime-js** (^2.10.0) - Realtime subscriptions do Supabase
- **firebase** (^10.8.0) - SDK do Firebase (Auth)

### Validação e Formulários
- **zod** (^3.22.4) - Validação de schemas TypeScript-first
- **react-hook-form** (^7.50.0) - Gerenciamento de formulários performático
- **@hookform/resolvers** (^3.3.4) - Resolvers para react-hook-form (Zod)

### Animações
- **framer-motion** (^11.0.0) - Biblioteca de animações para React
  - **Uso**: Animações suaves, transições, gestos
  - **Leve**: ~50KB gzipped
  - **Exemplo**: Animações no time picker, cards, modais

### Drag and Drop
- **@dnd-kit/core** (^6.1.0) - Core do DnD Kit (leve e moderno)
- **@dnd-kit/sortable** (^8.0.0) - Extensão para listas ordenáveis
- **@dnd-kit/utilities** (^3.2.2) - Utilitários do DnD Kit
  - **Uso**: Arrastar e reorganizar agendamentos, calendário
  - **Leve**: ~15KB gzipped
  - **Vantagem**: Mais leve que react-beautiful-dnd

### Gráficos
- **recharts** (^2.12.0) - Biblioteca de gráficos para React
  - **Uso**: Analytics, gráficos financeiros, métricas
  - **Leve**: ~80KB gzipped
  - **Vantagem**: Mais leve que Chart.js, composável

### Time Picker
- **react-time-picker** (^5.2.0) - Time picker básico
- **react-time-picker-input** (^5.2.0) - Input customizável
  - **Uso**: Seleção de horários (complementa nosso TimePickerSlider custom)
  - **Nota**: Usamos principalmente nosso componente custom com slider

### Utilitários
- **date-fns** (^3.3.0) - Manipulação de datas (leve e moderna)
  - **Uso**: Formatação, cálculos de data, timezones
  - **Leve**: ~15KB gzipped (tree-shakeable)
  - **Vantagem**: Mais leve que moment.js

### QR Code
- **qrcode.react** (^3.1.0) - Geração de QR Codes
  - **Uso**: QR Code da página pública do prestador

## 🎯 Por que essas bibliotecas?

### Princípios de Escolha
1. **Leveza**: Priorizamos bibliotecas pequenas e otimizadas
2. **Tree-shakeable**: Bibliotecas que permitem remover código não usado
3. **TypeScript**: Suporte nativo ou tipos disponíveis
4. **Manutenção**: Bibliotecas ativas e bem mantidas
5. **Performance**: Bibliotecas otimizadas para React

### Comparações

#### Animações
- ❌ **react-spring**: Mais pesado, mais complexo
- ✅ **framer-motion**: Leve, API simples, muito popular

#### Drag and Drop
- ❌ **react-beautiful-dnd**: ~100KB, não mantido ativamente
- ✅ **@dnd-kit**: ~15KB, moderno, mantido, acessível

#### Gráficos
- ❌ **Chart.js**: ~200KB, mais pesado
- ❌ **Victory**: ~150KB, mais complexo
- ✅ **recharts**: ~80KB, composável, React-native

#### Datas
- ❌ **moment.js**: ~70KB, não tree-shakeable
- ✅ **date-fns**: ~15KB, tree-shakeable, moderna

## 📊 Tamanho Total Estimado

- **Core (Next.js + React)**: ~150KB
- **Supabase + Firebase**: ~80KB
- **Animações (framer-motion)**: ~50KB
- **Gráficos (recharts)**: ~80KB
- **Drag and Drop (@dnd-kit)**: ~15KB
- **Outras**: ~30KB

**Total estimado (gzipped)**: ~405KB

## 🔄 Alternativas Consideradas

### Time Picker
- Consideramos criar componente 100% custom (fizemos!)
- `react-time-picker` como fallback/opção alternativa

### Calendário
- `react-calendar` foi removido (muito pesado)
- Criaremos componente custom com `date-fns`

### Gráficos
- Consideramos `chart.js` mas é mais pesado
- `recharts` é mais adequado para React

## 🚀 Otimizações Futuras

1. **Code Splitting**: Carregar libs pesadas apenas quando necessário
2. **Dynamic Imports**: Importar gráficos apenas na página de Analytics
3. **Tree Shaking**: Garantir que build remova código não usado
4. **Bundle Analysis**: Monitorar tamanho do bundle

## 📝 Notas

- Todas as libs são compatíveis com Next.js 14
- Todas suportam SSR (Server-Side Rendering)
- TypeScript types disponíveis para todas
- Libs são mantidas ativamente (última atualização < 6 meses)

## 🔍 Verificar Tamanho do Bundle

```bash
# Instalar analyzer
npm install --save-dev @next/bundle-analyzer

# Adicionar ao next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

# Executar
ANALYZE=true npm run build
```

---

**Última atualização**: 2024

