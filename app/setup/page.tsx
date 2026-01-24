'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { calculateRecommendedPlan } from '@/lib/utils/planCalculator'

interface OnboardingData {
  businessName: string
  phone: string
  teamSize: '1' | '2-5' | '5+' | null
  dailyAppointments: number
  averageTicket: number
}

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    businessName: '',
    phone: '',
    teamSize: null,
    dailyAppointments: 12,
    averageTicket: 85,
  })
  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  const handleFinish = async () => {
    try {
      setLoading(true)
      
      // Calcular plano recomendado
      const recommendedPlan = calculateRecommendedPlan(data)
      
      // Salvar dados no Supabase
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Atualizar usuário com dados do onboarding
        const { error: updateError } = await supabase
          .from('users')
          .update({
            business_name: data.businessName,
            phone: data.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('firebase_uid', user.id)

        if (updateError) throw updateError

        // Salvar dados de onboarding (criar tabela se necessário)
        const { error: onboardingError } = await supabase
          .from('user_onboarding')
          .upsert({
            user_id: user.id,
            team_size: data.teamSize,
            daily_appointments: data.dailyAppointments,
            average_ticket: data.averageTicket,
            recommended_plan: recommendedPlan.tier,
            recommended_price: recommendedPlan.price,
            updated_at: new Date().toISOString(),
          })

        if (onboardingError && onboardingError.code !== '42P01') {
          // Ignorar erro se tabela não existir (criaremos depois)
          console.warn('Tabela user_onboarding não existe ainda')
        }
      }

      // Redirecionar para dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao finalizar setup:', error)
      alert('Erro ao salvar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (planType: 'free' | 'pro') => {
    if (planType === 'free') {
      // Continuar com plano free (7 dias grátis)
      router.push('/dashboard')
    } else {
      // Redirecionar para checkout do plano pro
      const recommendedPlan = calculateRecommendedPlan(data)
      router.push(`/checkout?plan=pro&tier=${recommendedPlan.tier}&price=${recommendedPlan.price}`)
    }
  }

  return (
    <div className="bg-background-dark min-h-screen text-white">
      {step === 1 && (
        <SetupStep1
          data={data}
          setData={setData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <SetupStep2
          data={data}
          setData={setData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <SetupStep3
          data={data}
          setData={setData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 4 && (
        <SetupStep4
          data={data}
          onBack={handleBack}
          onSelectPlan={handleSelectPlan}
          loading={loading}
        />
      )}
    </div>
  )
}

// Passo 1: Dados Básicos
function SetupStep1({ data, setData, onNext, onBack }: any) {
  const canContinue = data.businessName.trim() && data.phone.trim()

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex items-center justify-between p-4 pt-6">
        <button onClick={onBack} className="flex h-12 w-12 items-center justify-start">
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">Passo 1 de 3</span>
          <div className="mt-1 flex gap-1">
            <div className="h-1 w-8 rounded-full bg-primary"></div>
            <div className="h-1 w-8 rounded-full bg-white/20"></div>
            <div className="h-1 w-8 rounded-full bg-white/20"></div>
          </div>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="px-4 pt-8">
        <h1 className="text-left text-[32px] font-bold leading-tight tracking-tight text-white">
          Vamos configurar seu espaço
        </h1>
        <p className="pt-2 text-left text-base font-normal leading-relaxed text-white/70">
          Preencha os dados básicos para começar a receber agendamentos de seus clientes.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-2 px-4">
        <div className="flex flex-wrap items-end gap-4 py-3">
          <label className="flex flex-1 flex-col min-w-40">
            <p className="pb-2 text-sm font-medium leading-normal text-white/90">Nome do Negócio</p>
            <input
              className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-xl border border-white/10 bg-white/5 p-[15px] text-base font-normal leading-normal text-white placeholder:text-white/30 focus:border-primary focus:outline-0 focus:ring-0"
              placeholder="Ex: Barbearia do João"
              type="text"
              value={data.businessName}
              onChange={(e) => setData({ ...data, businessName: e.target.value })}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-end gap-4 py-3">
          <label className="flex flex-1 flex-col min-w-40">
            <p className="pb-2 text-sm font-medium leading-normal text-white/90">Telefone de Contato</p>
            <div className="flex w-full flex-1 items-stretch">
              <input
                className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-l-xl border border-white/10 border-r-0 bg-white/5 p-[15px] text-base font-normal leading-normal text-white placeholder:text-white/30 focus:border-primary focus:outline-0 focus:ring-0"
                placeholder="+55 (11) 99999-9999"
                type="tel"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
              <div className="flex items-center justify-center rounded-r-xl border border-l-0 border-white/10 bg-white/5 pr-[15px] text-primary">
                <span className="material-symbols-outlined">chat</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/40">Usaremos este número para as confirmações automáticas.</p>
          </label>
        </div>
      </div>

      <div className="mt-auto p-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mb-6 flex items-center justify-center gap-2 px-2">
          <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          <p className="text-[13px] text-white/50">Seus dados estão protegidos e criptografados</p>
        </div>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-bold text-black transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
        <div className="mt-4 flex justify-center">
          <p className="text-sm text-white/40">Precisa de ajuda? <span className="text-primary/80 font-medium">Fale conosco</span></p>
        </div>
      </div>
    </div>
  )
}

// Passo 2: Tamanho da Equipe
function SetupStep2({ data, setData, onNext, onBack }: any) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex items-center justify-between p-4 pt-6">
        <button onClick={onBack} className="flex h-12 w-12 items-center justify-start rounded-full transition-opacity active:opacity-60">
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary/90">Passo 2 de 3</span>
          <div className="flex gap-1.5">
            <div className="h-1.5 w-8 rounded-full bg-primary shadow-[0_0_12px_rgba(19,236,91,0.6)]"></div>
            <div className="h-1.5 w-8 rounded-full bg-primary"></div>
            <div className="h-1.5 w-8 rounded-full bg-white/10"></div>
          </div>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="px-6 pt-6">
        <h1 className="text-left text-[32px] font-bold leading-tight tracking-tight text-white">
          Quantos colaboradores trabalham com você?
        </h1>
        <p className="pt-3 text-left text-[15px] font-normal leading-relaxed text-white/60">
          Escolha a opção que melhor descreve a estrutura atual do seu negócio para personalizarmos sua agenda.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 px-6">
        {[
          { value: '1', label: 'Apenas eu', subtitle: 'Trabalho sozinho(a)', icon: 'person' },
          { value: '2-5', label: '2 a 5 pessoas', subtitle: 'Equipe pequena', icon: 'groups' },
          { value: '5+', label: 'Mais de 5 pessoas', subtitle: 'Equipe em expansão', icon: 'domain' },
        ].map((option) => (
          <label key={option.value} className="group relative cursor-pointer">
            <input
              className="peer sr-only"
              name="team_size"
              type="radio"
              value={option.value}
              checked={data.teamSize === option.value}
              onChange={() => setData({ ...data, teamSize: option.value as any })}
            />
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10 peer-checked:border-primary peer-checked:bg-[rgba(19,236,91,0.08)] active:scale-[0.98]">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-colors peer-checked:bg-primary peer-checked:text-background-dark">
                <span className="material-symbols-outlined">{option.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white">{option.label}</span>
                <span className="text-sm text-white/50">{option.subtitle}</span>
              </div>
              <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/20 peer-checked:border-primary peer-checked:bg-primary">
                <span className="material-symbols-outlined text-[14px] font-bold text-background-dark opacity-0 peer-checked:opacity-100">check</span>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-auto p-6" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <button
          onClick={onNext}
          disabled={!data.teamSize}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-bold text-background-dark shadow-[0_0_20px_rgba(19,236,91,0.2)] transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

// Passo 3: Volume e Ticket Médio
function SetupStep3({ data, setData, onNext, onBack }: any) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex items-center justify-between p-4 pt-6">
        <button onClick={onBack} className="flex h-12 w-12 items-center justify-start">
          <span className="material-symbols-outlined text-white cursor-pointer">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">Passo 3 de 3</span>
          <div className="mt-1 flex gap-1">
            <div className="h-1 w-8 rounded-full bg-primary"></div>
            <div className="h-1 w-8 rounded-full bg-primary"></div>
            <div className="h-1 w-8 rounded-full bg-primary"></div>
          </div>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="px-4 pt-6">
        <h1 className="text-left text-[32px] font-bold leading-tight tracking-tight text-white">
          Volume e Ticket Médio
        </h1>
        <p className="pt-2 text-left text-base font-normal leading-relaxed text-white/70">
          Isso nos ajuda a preparar sua infraestrutura e personalizar sua experiência na plataforma.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6 px-4">
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors focus-within:border-primary/50 hover:bg-white/[0.07]">
          <div className="mb-6 flex flex-col">
            <label className="text-sm font-medium leading-normal text-white/90">Qual sua média de atendimentos diários?</label>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-primary">{data.dailyAppointments}</span>
              <span className="text-lg font-medium text-white/40">clientes/dia</span>
            </div>
          </div>
          <input
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary hover:bg-white/20"
            type="range"
            min="1"
            max="100"
            step="1"
            value={data.dailyAppointments}
            onChange={(e) => setData({ ...data, dailyAppointments: parseInt(e.target.value) })}
          />
          <div className="mt-3 flex justify-between text-xs font-medium text-white/30">
            <span>1</span>
            <span>100+</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors focus-within:border-primary/50 hover:bg-white/[0.07]">
          <div className="mb-6 flex flex-col">
            <label className="text-sm font-medium leading-normal text-white/90">Qual o valor médio por serviço?</label>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">R$</span>
              <span className="text-5xl font-bold tracking-tight text-primary">{data.averageTicket}</span>
              <span className="text-lg font-medium text-white/40">,00</span>
            </div>
          </div>
          <input
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary hover:bg-white/20"
            type="range"
            min="10"
            max="1000"
            step="5"
            value={data.averageTicket}
            onChange={(e) => setData({ ...data, averageTicket: parseInt(e.target.value) })}
          />
          <div className="mt-3 flex justify-between text-xs font-medium text-white/30">
            <span>R$ 10</span>
            <span>R$ 1.000+</span>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <button
          onClick={onNext}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-bold text-black shadow-[0_0_20px_rgba(19,236,91,0.2)] transition-transform active:scale-[0.98]"
        >
          Continuar
        </button>
        <div className="mt-6 flex justify-center pb-2">
          <p className="text-sm text-white/30">Passo 3 de 3</p>
        </div>
      </div>
    </div>
  )
}

// Passo 4: Plano Recomendado
function SetupStep4({ data, onBack, onSelectPlan, loading }: any) {
  const recommendedPlan = calculateRecommendedPlan(data)

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex items-center justify-between p-4 pt-6">
        <button onClick={onBack} className="flex h-12 w-12 items-center justify-start">
          <span className="material-symbols-outlined text-white/50">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">Passo 3 de 3</span>
          <div className="mt-1 flex gap-1">
            <div className="h-1 w-2 rounded-full bg-primary/30"></div>
            <div className="h-1 w-2 rounded-full bg-primary/30"></div>
            <div className="h-1 w-8 rounded-full bg-primary"></div>
          </div>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_30px_rgba(19,236,91,0.15)] ring-1 ring-primary/20">
            <span className="material-symbols-outlined text-[40px] text-primary">auto_awesome</span>
          </div>
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-white">
            Encontramos a infraestrutura ideal para você
          </h1>
          <p className="mt-3 text-[15px] font-normal leading-relaxed text-white/60">
            Com base na análise do seu perfil, este é o plano que maximiza seus resultados.
          </p>
        </div>

        <div className="relative mt-8 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-background-dark">Recomendado</p>
          </div>
          <div className="p-6">
            <div className="mb-1">
              <p className="text-xs font-bold text-primary/90 uppercase tracking-widest">Plano Personalizado</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Business Pro</h2>
            </div>
            <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">Estabilidade garantida</p>
                  <p className="text-xs text-white/50">Infraestrutura com 99.9% de uptime</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">Suporte prioritário</p>
                  <p className="text-xs text-white/50">Atendimento VIP via WhatsApp</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">Automação de Agenda</p>
                  <p className="text-xs text-white/50">Lembretes ilimitados para clientes</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 bg-white/5 px-6 py-4">
            <span className="text-sm text-white/50">Investimento mensal</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">R$ {recommendedPlan.price.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 pt-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mb-4 flex items-center justify-center gap-2 opacity-60">
          <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
          <p className="text-xs font-medium text-white/70">Garantia de 7 dias ou seu dinheiro de volta</p>
        </div>
        <button
          onClick={() => onSelectPlan('pro')}
          disabled={loading}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-bold text-background-dark shadow-[0_4px_20px_rgba(19,236,91,0.25)] transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Assinar Plano Ideal'}
        </button>
        <button
          onClick={() => onSelectPlan('free')}
          disabled={loading}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-xl text-sm font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white active:scale-[0.99] disabled:opacity-50"
        >
          Continuar com plano básico
        </button>
      </div>
    </div>
  )
}


