import { useState, useMemo } from "react"
import { useOfflineData } from "@/hooks/useOfflineData"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Shield, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoleDialog } from "@/pages/users/components/RoleDialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"

export default function Roles() {
  const { data: roles = [], isLoading: loading, delete: deleteRole, refetch } = useOfflineData<any>("roles")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null)

  const filteredRoles = useMemo(() => {
    return roles.filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [roles, searchTerm])

  const handleEdit = (role: any) => {
    setSelectedRole(role)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setRoleToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!roleToDelete) return
    try {
      await deleteRole(roleToDelete)
      toast.success("Role deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role")
    } finally {
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  return (
    <div className="flex-1 p-8 pt-6 space-y-4">
      <PageHeader
        title="Roles & Permissions"
        description="Manage system access levels and module permissions"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        showSearch
        primaryAction={{
          label: "Create Role",
          icon: Plus,
          onClick: () => { setSelectedRole(null); setIsDialogOpen(true) }
        }}
      />

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-50">Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">Loading roles...</TableCell>
                </TableRow>
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{role.description || "No description"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.length > 0 ? (
                          role.permissions.map((p: string) => (
                            <Badge key={p} variant="secondary" className="text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                              {p}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs italic text-muted-foreground">Full Access (Super Admin)</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(role)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(role.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RoleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        role={selectedRole}
        onSuccess={refetch}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Role"
        description="Are you sure you want to delete this role? This might affect user access."
        onConfirm={confirmDelete}
        variant="danger"
      />
    </div>
  )
}
