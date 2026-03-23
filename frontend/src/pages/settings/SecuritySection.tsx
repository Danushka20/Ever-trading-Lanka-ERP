import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, KeyRound, Shield, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
export function SecuritySection() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100/50">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Security & Access</h3>
            <p className="text-slate-500 text-sm font-medium">Manage credentials and authentication protocols</p>
          </div>
        </div>
      </div>
      <CardContent className="p-8 space-y-12">
        {/* Passwords Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <KeyRound className="h-3.5 w-3.5 text-indigo-500" />
              Password Protocol
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Standard credentials used for system entry. We recommend rotating this every 90 days.
            </p>
          </div>
          <div className="lg:col-span-8 space-y-5">
            <div className="space-y-2.5">
              <Label className="text-[13px] font-semibold text-slate-700 ml-1">Current Entry Key</Label>
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono tracking-widest"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label className="text-[13px] font-semibold text-slate-700 ml-1">New Entry Key</Label>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono tracking-widest"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute -translate-y-1/2 right-4 top-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[13px] font-semibold text-slate-700 ml-1">Confirm Identity Key</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono tracking-widest"
                />
              </div>
            </div>
            <div className="pt-2">
              <Button className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-12 font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95">
                Update Security Protocol
              </Button>
            </div>
          </div>
        </div>
        {/* 2FA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-slate-100">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Shield className="h-3.5 w-3.5 text-indigo-500" />
              Multi-Factor Auth
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Require an additional verification code from a trusted device when authenticating.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="p-6 border rounded-2xl border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Status: Inactive</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Device verification not configured</p>
                </div>
              </div>
              <Button variant="outline" className="h-11 border-slate-200 text-slate-600 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 rounded-xl px-6 transition-all font-bold shadow-sm bg-white">
                Enable Protocol
              </Button>
            </div>
          </div>
        </div>
        {/* Active Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-slate-100">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Lock className="h-3.5 w-3.5 text-indigo-500" />
              Active Sessions
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Realtime log of all hardware currently authenticated to this organizational account.
            </p>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 border rounded-2xl border-indigo-100 bg-indigo-50/10 flex items-center justify-between transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-50 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">Primary Session</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">Live</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Windows 11 • Chrome 122.0 • 192.168.1.1</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg font-bold text-[10px] tracking-widest uppercase transition-colors">Terminate</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
