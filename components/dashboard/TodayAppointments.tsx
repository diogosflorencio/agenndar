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
        <span className="material-symbols-outlined text-6xl text-dash-text-muted mb-4">event_busy</span>
        <p className="text-dash-text-muted text-center">Nenhum agendamento para hoje</p>
      </div>
    )
  }

  return (
    <>
      {schedules.map((schedule) => {
        const time = schedule.scheduled_time.substring(0, 5)
        return (
          <div
            key={schedule.id}
            className="flex flex-col rounded-2xl shadow-sm bg-dash-surface border border-dash-border overflow-hidden"
          >
            <div className="p-4 flex gap-4">
              <div className="size-20 rounded-xl bg-center bg-cover shrink-0 border border-dash-border overflow-hidden">
                {schedule.client.avatar_url ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${schedule.client.avatar_url})` }} />
                ) : (
                  <div className="w-full h-full bg-dash-primary-bg flex items-center justify-center">
                    <span className="text-dash-primary text-2xl font-bold">{schedule.client.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-dash-text text-lg font-bold leading-tight">{schedule.client.name}</h4>
                  <span className="text-dash-primary font-bold text-sm">• {time}</span>
                </div>
                <p className="text-dash-text-muted text-sm">{schedule.service.name}</p>
                {schedule.collaborator && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="material-symbols-outlined text-[16px] text-dash-text-muted">person</span>
                    <p className="text-dash-text-muted text-xs">Colaborador: {schedule.collaborator.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex border-t border-dash-border p-3 gap-3">
              <button
                type="button"
                onClick={() => onConfirmAttendance(schedule.id, false)}
                className="flex-1 h-11 flex items-center justify-center rounded-lg border border-dash-border bg-transparent text-dash-text text-sm font-semibold hover:bg-dash-surface-hover transition-colors"
              >
                Faltou
              </button>
              <button
                type="button"
                onClick={() => onConfirmAttendance(schedule.id, true)}
                className="flex-1 h-11 flex items-center justify-center rounded-lg bg-dash-primary text-white text-sm font-bold hover:opacity-90 transition-opacity"
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

