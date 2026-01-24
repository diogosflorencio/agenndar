interface OnboardingData {
  teamSize: '1' | '2-5' | '5+' | null
  dailyAppointments: number
  averageTicket: number
}

interface RecommendedPlan {
  tier: 'starter' | 'growth' | 'enterprise'
  price: number
  name: string
}

/**
 * Calcula o plano recomendado baseado no perfil do usuário
 * 
 * Lógica:
 * - Starter (R$ 29,90): Equipe pequena (1 pessoa) OU baixo volume (< 10/dia) OU ticket baixo (< R$ 50)
 * - Growth (R$ 89,90): Equipe média (2-5) E volume médio (10-30/dia) E ticket médio (R$ 50-150)
 * - Enterprise (R$ 129,90): Equipe grande (5+) OU alto volume (> 30/dia) OU ticket alto (> R$ 150)
 */
export function calculateRecommendedPlan(data: OnboardingData): RecommendedPlan {
  const { teamSize, dailyAppointments, averageTicket } = data

  // Calcular receita mensal estimada
  const monthlyRevenue = dailyAppointments * averageTicket * 30

  // Starter: Perfil menor
  if (
    teamSize === '1' ||
    dailyAppointments < 10 ||
    averageTicket < 50 ||
    monthlyRevenue < 15000
  ) {
    return {
      tier: 'starter',
      price: 29.90,
      name: 'Business Pro Starter',
    }
  }

  // Enterprise: Perfil maior
  if (
    teamSize === '5+' ||
    dailyAppointments > 30 ||
    averageTicket > 150 ||
    monthlyRevenue > 135000
  ) {
    return {
      tier: 'enterprise',
      price: 129.90,
      name: 'Business Pro Enterprise',
    }
  }

  // Growth: Perfil médio (padrão)
  return {
    tier: 'growth',
    price: 89.90,
    name: 'Business Pro Growth',
  }
}

/**
 * Retorna informações detalhadas do plano
 */
export function getPlanDetails(tier: 'starter' | 'growth' | 'enterprise') {
  const plans = {
    starter: {
      name: 'Business Pro Starter',
      price: 29.90,
      features: [
        'Até 50 agendamentos/mês',
        'Suporte por email',
        'Relatórios básicos',
        '1 colaborador',
      ],
    },
    growth: {
      name: 'Business Pro Growth',
      price: 89.90,
      features: [
        'Agendamentos ilimitados',
        'Suporte prioritário WhatsApp',
        'Relatórios avançados',
        'Até 5 colaboradores',
        'Automação de lembretes',
      ],
    },
    enterprise: {
      name: 'Business Pro Enterprise',
      price: 129.90,
      features: [
        'Agendamentos ilimitados',
        'Suporte VIP 24/7',
        'Analytics completo',
        'Colaboradores ilimitados',
        'Automação avançada',
        'API personalizada',
      ],
    },
  }

  return plans[tier]
}


