'use client'

interface DashboardHeaderProps {
  userName: string
  avatarUrl?: string
}

export default function DashboardHeader({ userName, avatarUrl }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-transparent">
      <div className="flex items-center px-5 py-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-primary">
            {avatarUrl ? (
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover w-full h-full"
                style={{ backgroundImage: `url(${avatarUrl})` }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-primary text-lg font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-primary font-medium">Olá, {userName.split(' ')[0]}</p>
            <h2 className="text-white text-xl font-bold leading-none tracking-tight">Dashboard</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex size-10 items-center justify-center rounded-full bg-surface border border-surface-border text-white hover:bg-surface-border transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
        </div>
      </div>
    </header>
  )
}

