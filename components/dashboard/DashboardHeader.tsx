'use client'

interface DashboardHeaderProps {
  userName: string
  avatarUrl?: string
}

export default function DashboardHeader({ userName, avatarUrl }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-dash-surface/95 backdrop-blur-md border-b border-dash-border">
      <div className="flex items-center px-5 py-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-dash-primary">
            {avatarUrl ? (
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover w-full h-full"
                style={{ backgroundImage: `url(${avatarUrl})` }}
              />
            ) : (
              <div className="w-full h-full bg-dash-primary-bg flex items-center justify-center">
                <span className="text-dash-primary text-lg font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-dash-primary font-medium">Olá, {userName.split(' ')[0]}</p>
            <h2 className="text-dash-text text-xl font-bold leading-none tracking-tight">Dashboard</h2>
          </div>
        </div>
        <button type="button" className="flex size-10 items-center justify-center rounded-full bg-dash-surface border border-dash-border text-dash-text-muted hover:bg-dash-surface-hover transition-colors">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
      </div>
    </header>
  )
}

