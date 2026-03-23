import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Mail, MessageSquare, BarChart3 } from 'lucide-react'

export function NotificationsSection() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white">
      <CardHeader className="px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Notifications</CardTitle>
            <CardDescription className="text-slate-500">Global system alerts and communication triggers</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-12">
        {/* Email Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
              Email Protocol
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[240px]">
              Configure automated outbound mail for specific system events and report distributions.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Invoice notifications', desc: 'Alerts when new invoices are generated' },
              { label: 'Payment alerts', desc: 'Notifications for successful settlements' },
              { label: 'Inventory updates', desc: 'Low stock warnings and level changes' }
            ].map((item, idx) => (
              <label key={idx} className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-300 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.label}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
          <div>
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
              Interface Alerts
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[240px]">
              Manage the realtime notifications that appear within the system sidebar and utility bar.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Order notifications', desc: 'Realtime updates on sales flow' },
              { label: 'System updates', desc: 'Maintenance and version change logs' }
            ].map((item, idx) => (
              <label key={idx} className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-300 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.label}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Daily Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
          <div>
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
              Analytic Digests
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[240px]">
              Subscribe to automated summary reporting for high-level business intelligence.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Sales summary', desc: 'End of day performance metric report' },
              { label: 'Financial report', desc: 'Weekly transaction and balance summary' }
            ].map((item, idx) => (
              <label key={idx} className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-300 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.label}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-10 flex justify-end">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-indigo-100 font-bold transition-all hover:scale-[1.02] active:scale-95">
            Commit Preferences
          </Button>
        </div>
      </CardContent>
    </div>
  )
}
