import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, Trash2, Mail, ShieldCheck, UserPlus, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { toast } from "sonner"

export function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviting, setIsInviting] = useState(false)
  const [inviteForm, setInviteForm] = useState({ email: "", role: "Standard User" })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/users')
      if (Array.isArray(response.data)) {
        setTeamMembers(response.data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.roles?.[0]?.name || 'User',
          avatar: u.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
          status: 'Active'
        })))
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteForm.email) return

    setIsInviting(true)
    try {
      // For now, we use store to create a user with a temporary password
      await api.post('/users', {
        name: inviteForm.email.split('@')[0],
        email: inviteForm.email,
        password: 'password123', // Admin sets initial password
        roles: [inviteForm.role.toLowerCase().replace(' ', '-')]
      })
      toast.success('User created and invited')
      setInviteForm({ email: "", role: "Standard User" })
      fetchMembers()
    } catch (error) {
      toast.error('Failed to invite user')
    } finally {
      setIsInviting(false)
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to remove this member?')) return
    try {
      await api.delete(`/users/${userId}`)
      toast.success('Member removed')
      fetchMembers()
    } catch (error) {
      toast.error('Failed to remove member')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="duration-500 bg-white animate-in fade-in slide-in-from-bottom-2">
      <div className="sticky top-0 z-10 px-8 py-6 border-b bg-white/80 backdrop-blur-md border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 text-indigo-600 shadow-sm bg-indigo-50 rounded-2xl shadow-indigo-100/50">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Personnel & Access</h3>
            <p className="text-sm font-medium text-slate-500">Manage organizational members and permission tiers</p>
          </div>
        </div>
      </div>
      <CardContent className="p-8 space-y-12">
        {/* Invitation Section */}
        <form onSubmit={handleInvite} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <UserPlus className="h-3.5 w-3.5 text-indigo-500" />
              Onboarding Protocol
            </h4>
            <p className="text-xs font-medium leading-relaxed text-slate-400">
              Dispatch encrypted invitations to new personnel. Defined roles dictate system-wide access levels.
            </p>
          </div>
          <div className="space-y-5 lg:col-span-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-[13px] font-semibold text-slate-700 ml-1">Recipient Identity (Email)</Label>
                <div className="relative group">
                  <Input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(p => ({...p, email: e.target.value}))}
                    placeholder="personnel@organization.com"
                    className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 pl-11"
                  />
                  <Mail className="absolute w-4 h-4 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-hover:text-indigo-500" />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[13px] font-semibold text-slate-700 ml-1">Assigned Clearance</Label>
                <div className="relative group">
                  <select 
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm(p => ({...p, role: e.target.value}))}
                    className="w-full h-12 text-sm font-medium transition-all bg-white border appearance-none px-11 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                  >
                    <option value="admin">System Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="user">Standard User</option>
                  </select>
                  <ShieldCheck className="absolute w-4 h-4 -translate-y-1/2 left-4 top-1/2 text-slate-400" />
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button 
                type="submit"
                disabled={isInviting}
                className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-12 font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
              >
                {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="h-4 w-4 stroke-[3px]" />}
                Dispatch Invitation
              </Button>
            </div>
          </div>
        </form>
        {/* Members List */}
        <div className="grid grid-cols-1 gap-10 pt-10 border-t lg:grid-cols-12 border-slate-100">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <Users className="h-3.5 w-3.5 text-indigo-500" />
              Active Registry
            </h4>
            <p className="text-xs font-medium leading-relaxed text-slate-400">
              Complete log of all personnel currently holding active authorization within this environment.
            </p>
          </div>
          <div className="space-y-4 lg:col-span-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-5 transition-all bg-white border group border-slate-100 rounded-2xl hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex items-center justify-center text-sm font-black text-indigo-600 transition-transform border shadow-sm w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border-indigo-50 group-hover:scale-110">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${member.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{member.name}</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">{member.role}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{member.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(member.id)}
                    className="transition-all h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  )
}
                     