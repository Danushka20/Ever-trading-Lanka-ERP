import { Sliders, Globe, Coins, Monitor, Loader2 } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { usePreferences } from '@/hooks/usePreferences'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export function PreferencesSection() {
  const { preferences, isLoading, updatePreferences } = usePreferences();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100/50">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">App Settings</h3>
              <p className="text-slate-500 text-sm font-medium">Interface & localization parameters</p>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-8 space-y-12">
        {/* Localization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Globe className="h-3.5 w-3.5 text-indigo-500" />
              Localization
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Define how the system appears based on your geographical and cultural requirements.
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-[13px] font-semibold text-slate-700 ml-1">Language</Label>
              <Select 
                value={preferences.language} 
                onValueChange={(v) => updatePreferences({ language: v })}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="si">Sinhala</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-[13px] font-semibold text-slate-700 ml-1">Timezone</Label>
              <Select 
                value={preferences.timezone} 
                onValueChange={(v) => updatePreferences({ timezone: v })}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10">
                  <SelectValue placeholder="Select Timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Universal)</SelectItem>
                  <SelectItem value="Asia/Colombo">Asia/Colombo (IST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Financial Display Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-slate-100">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Coins className="h-3.5 w-3.5 text-indigo-500" />
              Financials
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Currency and monetary display settings for all reports and transactions.
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-[13px] font-semibold text-slate-700 ml-1">Base Currency</Label>
              <Select 
                value={preferences.currency} 
                onValueChange={(v) => updatePreferences({ currency: v })}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LKR">LKR (Rs.)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-[13px] font-semibold text-slate-700 ml-1">Date Format</Label>
              <Select 
                value={preferences.dateFormat} 
                onValueChange={(v) => updatePreferences({ dateFormat: v })}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YYYY-MM-DD">2024-03-25</SelectItem>
                  <SelectItem value="DD/MM/YYYY">25/03/2024</SelectItem>
                  <SelectItem value="MM/DD/YYYY">03/25/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Interface Customization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-slate-100">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Monitor className="h-3.5 w-3.5 text-indigo-500" />
              Interface
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Visual preferences for the dashboard and list views.
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-[13px] font-semibold text-slate-700 ml-1">Color Theme</Label>
              <Select 
                value={preferences.theme} 
                onValueChange={(v: any) => updatePreferences({ theme: v })}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-[13px] font-semibold text-slate-700 ml-1">Default List Rows</Label>
              <Select 
                value={preferences.rowsPerPage.toString()} 
                onValueChange={(v) => updatePreferences({ rowsPerPage: parseInt(v) })}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500/10">
                  <SelectValue placeholder="Select Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Rows</SelectItem>
                  <SelectItem value="25">25 Rows</SelectItem>
                  <SelectItem value="50">50 Rows</SelectItem>
                  <SelectItem value="100">100 Rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}

