'use client'

import { format } from 'date-fns'

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

interface TodayAppointmentsProps {
  schedules: Schedule[]
  onConfirmAttendance: (scheduleId: string, attended: boolean) => void
}

export default function TodayAppointments({ schedules, onConfirmAttendance }: TodayAppointmentsProps) {
  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-5">
        <span className="material-symbols-outlined text-6xl text-text-muted mb-4">event_busy</span>
        <p className="text-text-muted text-center">Nenhum agendamento para hoje</p>
      </div>
    )
  }

  return (
    <>
      {schedules.map((schedule) => {
        const time = schedule.scheduled_time.substring(0, 5) // HH:mm
        
        return (
          <div 
            key={schedule.id}
            className="flex flex-col rounded-2xl shadow-card bg-surface border border-surface-border overflow-hidden"
          >
            <div className="p-4 flex gap-4">
              <div className="size-20 rounded-xl bg-center bg-cover shrink-0 border border-white/5 overflow-hidden">
                {schedule.client.avatar_url ? (
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${schedule.client.avatar_url})` }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-primary text-2xl font-bold">
                      {schedule.client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-white text-lg font-bold leading-tight">{schedule.client.name}</h4>
                  <span className="text-primary font-bold text-sm">• {time}</span>
                </div>
                <p className="text-text-muted text-sm">{schedule.service.name}</p>
                {schedule.collaborator && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="material-symbols-outlined text-[16px] text-text-muted">person</span>
                    <p className="text-text-muted text-xs">Colaborador: {schedule.collaborator.name}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex border-t border-surface-border p-3 gap-3">
              <button 
                onClick={() => onConfirmAttendance(schedule.id, false)}
                className="flex-1 h-11 flex items-center justify-center rounded-lg border border-surface-border bg-transparent text-white text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Faltou
              </button>
              <button 
                onClick={() => onConfirmAttendance(schedule.id, true)}
                className="flex-1 h-11 flex items-center justify-center rounded-lg bg-primary text-background-dark text-sm font-bold shadow-glow hover:bg-primary/90 transition-colors"
              >
                Compareceu
              </button>
            </div>
          </div>
        )
      })}
    </>
  )
}

