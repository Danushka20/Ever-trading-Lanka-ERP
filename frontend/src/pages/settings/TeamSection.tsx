import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, Trash2, Award, Mail, ShieldCheck, UserPlus } from "lucide-react"
export function TeamSection() {
  const teamMembers = [
    { id: 1, name: "Narendra Kumar", email: "admin@growledger.com", role: "Super Admin", avatar: "NK", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@growledger.com", role: "Manager", avatar: "JS", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@growledger.com", role: "Finance", avatar: "MJ", status: "Invited" },
  ]
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100/50">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Personnel & Access</h3>
            <p className="text-slate-500 text-sm font-medium">Manage organizational members and permission tiers</p>
          </div>
        </div>
      </div>
      <CardContent className="p-8 space-y-12">
        {/* Invitation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <UserPlus className="h-3.5 w-3.5 text-indigo-500" />
              Onboarding Protocol
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Dispatch encrypted invitations to new personnel. Defined roles dictate system-wide access levels.
            </p>
          </div>
          <div className="lg:col-span-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label className="text-[13px] font-semibold text-slate-700 ml-1">Recipient Identity (Email)</Label>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="personnel@organization.com"
                    className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all pl-11"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[13px] font-semibold text-slate-700 ml-1">Assigned Clearance</Label>
                <div className="relative group">
                  <select className="w-full h-12 px-11 border border-slate-200 rounded-xl bg-white text-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-sm">
                    <option>Standard User</option>
                    <option>Finance Manager</option>
                    <option>System Administrator</option>
                  </select>
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Step 19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-12 font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
                <Plus className="h-4 w-4 stroke-[3px]" />
                Dispatch Invitation
              </Button>
            </div>
          </div>
        </div>
        {/* Members List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-slate-100">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Users className="h-3.5 w-3.5 text-indigo-500" />
              Active Registry
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Complete log of all personnel currently holding active authorization within this environment.
            </p>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between transition-all hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-50 flex items-center justify-center text-indigo-600 text-lg font-black shadow-sm group-hover:scale-110 transition-transform">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 uppercase tracking-tight">{member.name}</p>
                      {member.status === "Invited" && (
                        <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Pending</span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clearance Level</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 uppercase tracking-tight">
                      <Award className="h-3 w-3" />
                      {member.role}
                    </span>
                  </div>
                  {member.id !== 1 ? (
                    <button className="p-3 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all active:scale-95 border border-transparent hover:border-red-100 shadow-sm">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  ) : (
                    <div className="p-3 bg-indigo-50/50 text-indigo-400 rounded-xl border border-indigo-100/50">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  )
}
