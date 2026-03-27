import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"

export function NotificationsSection() {
  const { settings, updateSetting } = useNotifications()

  const notificationItems = [
    { key: "invoiceCreated", label: "Invoice notifications", desc: "Alerts when new invoices are generated" },
    { key: "paymentReceived", label: "Payment alerts", desc: "Notifications for successful settlements" },
    { key: "lowStock", label: "Inventory updates", desc: "Low stock warnings and level changes" },
    { key: "orderStatusChanged", label: "Order tracking", desc: "Updates on delivery and fulfillment status" }
  ] as const

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
              Communications Protocol
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[240px]">
              Configure automated triggers for specific system events and report distributions.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notificationItems.map((item) => (
              <label 
                key={item.key} 
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  settings[item.key] 
                    ? "border-indigo-100 bg-indigo-50/20" 
                    : "border-slate-100 bg-slate-50/50"
                } hover:border-indigo-200 hover:shadow-md`}
              >
                <input 
                  type="checkbox" 
                  checked={settings[item.key]} 
                  onChange={(e) => updateSetting(item.key, e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer" 
                />
                <div className="flex flex-col">
                  <span className={`text-sm font-bold transition-colors uppercase tracking-tight ${
                    settings[item.key] ? "text-indigo-600" : "text-slate-800"
                  }`}>{item.label}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
          <div>
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
              System Alerts
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[240px]">
              Configure critical system-wide notifications and maintenance alerts.
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
               <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-300 mb-4">
                  <Bell className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-slate-800">Push Notifications Coming Soon</p>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Browser-based alerts are currently in development</p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
