import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useOfflineData } from "@/hooks/useOfflineData"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: any
  onSuccess: () => void
}

const MODULES = [
  { id: "inventory", label: "Inventory Management" },
  { id: "sales", label: "Sales & Invoicing" },
  { id: "purchase", label: "Purchase & Suppliers" },
  { id: "finance", label: "Finance & Banking" },
  { id: "management", label: "System Management" },
  { id: "reports", label: "Reporting" }
]

const PERMISSIONS = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" }
]

export function RoleDialog({ open, onOpenChange, role, onSuccess }: RoleDialogProps) {
  const { create, update } = useOfflineData<any>("roles")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  })

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
        permissions: role.permissions || []
      })
    } else {
      setFormData({ name: "", description: "", permissions: [] })
    }
  }, [role, open])

  const togglePermission = (moduleId: string, permId: string) => {
    const key = `${moduleId}.${permId}`
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter(p => p !== key)
        : [...prev.permissions, key]
    }))
  }

  const toggleModule = (moduleId: string) => {
    const modulePerms = PERMISSIONS.map(p => `${moduleId}.${p.id}`)
    const allSelected = modulePerms.every(p => formData.permissions.includes(p))

    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !modulePerms.includes(p))
        : [...new Set([...prev.permissions, ...modulePerms])]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error("Role name is required")
      return
    }

    setLoading(true)
    try {
      if (role?.id) {
        await update(role.id, formData)
        toast.success("Role updated successfully")
      } else {
        await create(formData)
        toast.success("Role created successfully")
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] flex flex-col p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>Define permissions for this system role.</DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Sales Manager"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the role responsibilities"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-bold">Permissions Deck</Label>
                <div className="border rounded-lg overflow-hidden border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-slate-700">Module</th>
                        {PERMISSIONS.map(p => (
                          <th key={p.id} className="text-center px-4 py-3 font-semibold text-slate-700">
                            {p.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MODULES.map(module => (
                        <tr key={module.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`mod-${module.id}`}
                                checked={PERMISSIONS.every(p => formData.permissions.includes(`${module.id}.${p.id}`))}
                                onCheckedChange={() => toggleModule(module.id)}
                              />
                              <label htmlFor={`mod-${module.id}`} className="font-medium text-slate-900 cursor-pointer">
                                {module.label}
                              </label>
                            </div>
                          </td>
                          {PERMISSIONS.map(perm => (
                            <td key={perm.id} className="text-center px-4 py-3">
                              <Checkbox
                                checked={formData.permissions.includes(`${module.id}.${perm.id}`)}
                                onCheckedChange={() => togglePermission(module.id, perm.id)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-2 border-t mt-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Saving..." : (role ? "Update Role" : "Create Role")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
