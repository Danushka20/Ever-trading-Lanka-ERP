import { Building2, Sliders, Bell, Lock, Users, HelpCircle } from 'lucide-react'
import type { ComponentType, SVGAttributes } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type LucideIcon = ComponentType<SVGAttributes<SVGElement>>

interface SettingsNavItem {
  id: string
  label: string
  icon: LucideIcon
  description: string
}

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const SETTINGS_ITEMS: SettingsNavItem[] = [
  {
    id: 'company',
    label: 'Company Profile',
    icon: Building2,
    description: 'Entity identity & branding',
  },
  {
    id: 'preferences',
    label: 'App Settings',
    icon: Sliders,
    description: 'Interface & localization',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'System alerts & updates',
  },
  {
    id: 'security',
    label: 'Security & Access',
    icon: Lock,
    description: 'Privacy & credentials',
  },
  {
    id: 'team',
    label: 'Team Management',
    icon: Users,
    description: 'Members & permissions',
  },
  {
    id: 'help',
    label: 'Support Center',
    icon: HelpCircle,
    description: 'Resources & documents',
  },
]

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="space-y-1.5">
          {SETTINGS_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.04)] text-slate-900 border border-slate-100'
                    : 'hover:bg-slate-100/50 text-slate-500 hover:text-slate-700'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
                )}
                
                <div className={`flex items-center justify-center p-2 rounded-lg transition-colors duration-300 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex flex-col items-start overflow-hidden text-left">
                  <span className={`text-sm font-semibold leading-none mb-1 transition-colors duration-300 ${
                    isActive ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    {item.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium truncate w-full">
                    {item.description}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
