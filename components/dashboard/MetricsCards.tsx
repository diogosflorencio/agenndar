'use client'

interface MetricsCardsProps {
  metrics: {
    agendamentos: number
    cancelados: number
    faltas: number
    agendamentosChange: number
    canceladosChange: number
  }
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <section className="px-5 py-2">
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex min-w-[140px] flex-1 flex-col justify-between gap-3 rounded-2xl p-4 bg-dash-surface shadow-sm border border-dash-border">
          <p className="text-dash-text-muted text-sm font-medium">Agendamentos</p>
          <div className="flex items-end gap-2">
            <p className="text-dash-text text-3xl font-bold leading-none">{metrics.agendamentos}</p>
            <span className="text-dash-primary text-xs font-bold mb-0.5">
              {metrics.agendamentosChange > 0 ? '+' : ''}{metrics.agendamentosChange}%
            </span>
          </div>
        </div>
        <div className="flex min-w-[140px] flex-1 flex-col justify-between gap-3 rounded-2xl p-4 bg-dash-surface shadow-sm border border-dash-border">
          <p className="text-dash-text-muted text-sm font-medium">Cancelados</p>
          <div className="flex items-end gap-2">
            <p className="text-dash-text text-3xl font-bold leading-none">{metrics.cancelados}</p>
            <span className={`text-xs font-bold mb-0.5 ${metrics.canceladosChange < 0 ? 'text-red-500' : 'text-dash-text-muted'}`}>
              {metrics.canceladosChange > 0 ? '+' : ''}{metrics.canceladosChange}%
            </span>
          </div>
        </div>
        <div className="flex min-w-[140px] flex-1 flex-col justify-between gap-3 rounded-2xl p-4 bg-dash-surface shadow-sm border border-dash-border">
          <p className="text-dash-text-muted text-sm font-medium">Faltas</p>
          <div className="flex items-end gap-2">
            <p className="text-dash-text text-3xl font-bold leading-none">{metrics.faltas}</p>
            <span className="text-dash-text-muted text-xs font-bold mb-0.5">estável</span>
          </div>
        </div>
      </div>
    </section>
  )
}

