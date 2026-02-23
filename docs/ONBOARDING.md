# Sistema de Onboarding - Agenndar

Este documento detalha o fluxo de onboarding e a lógica de recomendação de planos.

## 🎯 Objetivo

O onboarding coleta informações do usuário para:
1. Personalizar a experiência na plataforma
2. Recomendar o plano ideal baseado no perfil
3. Otimizar a precificação dinâmica

## 📋 Fluxo de Onboarding

### Passo 1: Dados Básicos
- **Nome do Negócio**: Identificação do estabelecimento
- **Telefone de Contato**: Para confirmações automáticas

### Passo 2: Tamanho da Equipe
- **Apenas eu** (1 pessoa)
- **2 a 5 pessoas** (equipe pequena)
- **Mais de 5 pessoas** (equipe em expansão)

### Passo 3: Volume e Ticket Médio
- **Média de atendimentos diários**: Slider de 1 a 100+
- **Valor médio por serviço**: Slider de R$ 10 a R$ 1.000+

### Passo 4: Plano Recomendado
- Exibe plano personalizado baseado no perfil
- Opção de assinar plano recomendado ou continuar com plano básico

## 💰 Sistema de Planos

### Plano Free (Básico)
- **Duração**: 7 dias grátis
- **Funcionalidades**: Todas as funcionalidades da plataforma
- **Objetivo**: Permitir experimentação completa

### Plano Pro - Starter (R$ 29,90)
**Perfil**: Negócios menores
- Equipe: 1 pessoa
- Volume: < 10 atendimentos/dia
- Ticket: < R$ 50
- Receita mensal: < R$ 15.000

**Funcionalidades**:
- Até 50 agendamentos/mês
- Suporte por email
- Relatórios básicos
- 1 colaborador

### Plano Pro - Growth (R$ 89,90)
**Perfil**: Negócios em crescimento (padrão)
- Equipe: 2-5 pessoas
- Volume: 10-30 atendimentos/dia
- Ticket: R$ 50-150
- Receita mensal: R$ 15.000 - R$ 135.000

**Funcionalidades**:
- Agendamentos ilimitados
- Suporte prioritário WhatsApp
- Relatórios avançados
- Até 5 colaboradores
- Automação de lembretes

### Plano Pro - Enterprise (R$ 129,90)
**Perfil**: Negócios estabelecidos
- Equipe: 5+ pessoas
- Volume: > 30 atendimentos/dia
- Ticket: > R$ 150
- Receita mensal: > R$ 135.000

**Funcionalidades**:
- Agendamentos ilimitados
- Suporte VIP 24/7
- Analytics completo
- Colaboradores ilimitados
- Automação avançada
- API personalizada

## 🧮 Lógica de Recomendação

A função `calculateRecommendedPlan()` analisa:

1. **Tamanho da equipe**
2. **Volume diário de atendimentos**
3. **Ticket médio**
4. **Receita mensal estimada** (volume × ticket × 30 dias)

### Prioridades de Classificação

1. **Starter**: Qualquer critério menor
2. **Enterprise**: Qualquer critério maior
3. **Growth**: Perfil médio (padrão)

### Exemplos

**Exemplo 1: Starter**
- Equipe: 1 pessoa
- Volume: 8 atendimentos/dia
- Ticket: R$ 40
- → **R$ 29,90**

**Exemplo 2: Growth**
- Equipe: 3 pessoas
- Volume: 20 atendimentos/dia
- Ticket: R$ 80
- → **R$ 89,90**

**Exemplo 3: Enterprise**
- Equipe: 8 pessoas
- Volume: 50 atendimentos/dia
- Ticket: R$ 200
- → **R$ 129,90**

## 💾 Armazenamento de Dados

### Tabela `user_onboarding`
Armazena os dados coletados durante o onboarding:

```sql
- user_id (UUID, FK para users)
- team_size (TEXT: '1', '2-5', '5+')
- daily_appointments (INTEGER)
- average_ticket (DECIMAL)
- recommended_plan (TEXT: 'starter', 'growth', 'enterprise')
- recommended_price (DECIMAL)
```

### Integração
- Dados salvos após cada passo
- Plano recomendado calculado no passo 4
- Informações usadas para personalização do dashboard

## 🎨 Interface

### Design
- **Background**: `#102216` (verde escuro)
- **Primary**: `#13ec5b` (verde claro)
- **Cards**: `bg-white/5` com bordas `border-white/10`
- **Progress**: Indicadores visuais de progresso

### Componentes
- Sliders customizados para volume e ticket
- Radio buttons estilizados para tamanho da equipe
- Cards de plano com destaque visual
- Botões com feedback tátil (active:scale)

## 🔄 Fluxo de Navegação

```
Login → Setup (Passo 1) → Passo 2 → Passo 3 → Passo 4 → Dashboard
                                    ↓
                            [Plano Free] ou [Checkout Pro]
```

## 📊 Analytics

Os dados de onboarding podem ser usados para:
- Análise de perfil de usuários
- Otimização de precificação
- Personalização de features
- Marketing segmentado

## 🔐 Segurança

- Dados criptografados
- RLS habilitado na tabela
- Validação de inputs
- Sanitização de dados

## 🚀 Melhorias Futuras

- [ ] A/B testing de preços
- [ ] Machine learning para recomendação
- [ ] Análise de conversão por perfil
- [ ] Upsell automático baseado em uso
- [ ] Dashboard de analytics de onboarding

---

**Última atualização**: 2024




