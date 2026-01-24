'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import MetricsCards from '@/components/dashboard/MetricsCards'
import TodayAppointments from '@/components/dashboard/TodayAppointments'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import BottomNavigation from '@/components/dashboard/BottomNavigation'

interface User {
  id: string
  business_name: string
  avatar_url?: string
}

interface Schedule {
  id: string
  client: {
    name: string
    avatar_url?: string
  }
  service: {
    name: string
  }
  collaborator?: {
    name: string
  }
  scheduled_time: string
  scheduled_date: string
  status: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [metrics, setMetrics] = useState({
    agendamentos: 0,
    cancelados: 0,
    faltas: 0,
    agendamentosChange: 0,
    canceladosChange: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      
      // Buscar usuário atual (simulado - depois integrar com Firebase Auth)
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .limit(1)
        .single()

      if (userData) {
        setUser(userData)
        
        // Buscar agendamentos do dia
        const today = format(new Date(), 'yyyy-MM-dd')
        const { data: schedulesData } = await supabase
          .from('schedules')
          .select(`
            *,
            clients:client_id (name, avatar_url),
            services:service_id (name),
            collaborators:collaborator_id (name)
          `)
          .eq('user_id', userData.id)
          .eq('scheduled_date', today)
          .in('status', ['agendado', 'pendente'])
          .order('scheduled_time', { ascending: true })

        if (schedulesData) {
          const formattedSchedules = schedulesData.map((schedule: any) => ({
            id: schedule.id,
            client: {
              name: schedule.clients?.name || 'Cliente',
              avatar_url: schedule.clients?.avatar_url,
            },
            service: {
              name: schedule.services?.name || 'Serviço',
            },
            collaborator: schedule.collaborators ? {
              name: schedule.collaborators.name,
            } : undefined,
            scheduled_time: schedule.scheduled_time,
            scheduled_date: schedule.scheduled_date,
            status: schedule.status,
          }))
          setSchedules(formattedSchedules)
        }

        // Buscar métricas
        const { data: metricsData } = await supabase
          .from('schedules')
          .select('status')
          .eq('user_id', userData.id)

        if (metricsData) {
          const agendamentos = metricsData.filter(s => s.status === 'agendado' || s.status === 'pendente').length
          const cancelados = metricsData.filter(s => s.status === 'cancelado').length
          const faltas = metricsData.filter(s => s.status === 'faltou').length

          setMetrics({
            agendamentos,
            cancelados,
            faltas,
            agendamentosChange: 15, // Simulado - calcular depois
            canceladosChange: -5, // Simulado
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmAttendance(scheduleId: string, attended: boolean) {
    try {
      const newStatus = attended ? 'compareceu' : 'faltou'
      
      const { error } = await supabase
        .from('schedules')
        .update({ 
          status: newStatus,
          confirmed_at: attended ? new Date().toISOString() : null,
        })
        .eq('id', scheduleId)

      if (error) throw error

      // Recarregar dados
      loadDashboardData()
    } catch (error) {
      console.error('Erro ao confirmar comparecimento:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center">
        <div className="text-primary">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="bg-background-dark min-h-screen text-white pb-28 antialiased selection:bg-primary/30">
      <DashboardHeader 
        userName={user?.business_name || 'Usuário'}
        avatarUrl={user?.avatar_url}
      />
      
      <MetricsCards metrics={metrics} />
      
      <div className="px-5 pt-6 pb-3 flex justify-between items-center">
        <h3 className="text-white text-xl font-bold tracking-tight">Próximos do Dia</h3>
        <span className="text-xs text-primary font-semibold px-3 py-1 bg-surface border border-surface-border rounded-full">
          {format(new Date(), "dd 'de' MMM", { locale: ptBR })}
        </span>
      </div>

      <main className="px-5 space-y-4 pb-4">
        <TodayAppointments 
          schedules={schedules}
          onConfirmAttendance={handleConfirmAttendance}
        />
      </main>

      <BottomNavigation currentRoute="dashboard" />
    </div>
  )
}

