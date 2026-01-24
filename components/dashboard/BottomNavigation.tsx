'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BottomNavigationProps {
  currentRoute?: string
}

export default function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  const pathname = usePathname()
  
  const isActive = (route: string) => {
    if (currentRoute) return currentRoute === route
    return pathname?.includes(route)
  }

  const navItems = [
    { icon: 'grid_view', label: 'Início', route: 'dashboard' },
    { icon: 'calendar_month', label: 'Agenda', route: 'agenda' },
    { icon: 'content_cut', label: 'Serviços', route: 'servicos' },
    { icon: 'groups', label: 'Equipe', route: 'equipe' },
    { icon: 'person', label: 'Conta', route: 'conta' },
  ]

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background-dark/90 backdrop-blur-md border-t border-surface-border px-4 py-3 pb-8 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const active = isActive(item.route)
          return (
            <Link
              key={item.route}
              href={`/dashboard/${item.route}`}
              className="flex flex-col items-center gap-1.5 flex-1 group"
            >
              <span 
                className={`material-symbols-outlined text-[24px] transition-colors ${
                  active ? 'text-primary' : 'text-text-muted group-hover:text-white'
                }`}
              >
                {item.icon}
              </span>
              <span 
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'font-bold text-primary' : 'text-text-muted group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="h-4 w-full fixed bottom-0 bg-background-dark/90 backdrop-blur-md z-50"></div>
    </>
  )
}

