import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, KeyRound, Shield, Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { useSecurity } from "@/hooks/useSecurity"
export function SecuritySection() {
  const [showPassword, setShowPassword] = useState(false)
  const { isChangingPassword, changePassword } = useSecurity()
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }
    const success = await changePassword({
      current_password: passwordForm.currentPassword,
      password: passwordForm.newPassword,
      password_confirmation: passwordForm.confirmPassword
    })
    if (success) {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    }
  }
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
        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
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
              <Input
                type={showPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(p => ({...p, currentPassword: e.target.value}))}
                placeholder="************"
                className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono tracking-widest"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5 font-bold">
                <Label className="text-[13px] font-semibold text-slate-700 ml-1">New Entry Key</Label>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(p => ({...p, newPassword: e.target.value}))}
                    placeholder="************"
                    className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono tracking-widest"
                  />
                  <button
                    type="button"
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
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(p => ({...p, confirmPassword: e.target.value}))}
                  placeholder="************"
                  className="h-12 bg-slate-50 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono tracking-widest"
                />
              </div>
            </div>
            <div className="pt-2">
              <Button 
                type="submit"
                disabled={isChangingPassword}
                className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-12 font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95"
              >
                {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Security Protocol
              </Button>
            </div>
          </div>
        </form>
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
                Enable 2FA
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
