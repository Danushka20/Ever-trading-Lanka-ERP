import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, Plus } from "lucide-react";
import { UserTable } from '@/components/users/UserTable';
import { UserDialog } from '@/components/users/UserDialog';
import { PageHeader } from "@/components/ui/page-header";
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBUser } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const UsersPage = () => {
    const { data: users = [], isLoading: loading, create, delete: deleteUser, refetch } = useOfflineData<DBUser>("users");
    const { data: roles = [] } = useOfflineData<any>("roles");
    const [searchQuery, setSearchQuery] = useState("");
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", roles: ["user"] });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
            (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
        ) as any[]
    }, [users, searchQuery]);

    const handleCreateUser = async () => {
        try { 
            await create(newUser as any); 
            setIsDialogOpen(false); 
            toast.success("User created successfully");
            setNewUser({ name: "", email: "", password: "", roles: ["user"] }); 
        }
        catch (e: any) { 
            console.error("Error creating user", e); 
            toast.error(e.message || "Failed to create user");
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try { 
            await deleteUser(id); 
            toast.success("User deleted");
        }
        catch (e: any) { 
            console.error("Error deleting user", e); 
            toast.error(e.message || "Failed to delete user");
        }
    };

    return (
        <div className="flex-1 min-h-screen p-8 pt-6 space-y-6 bg-slate-50/50">
            <PageHeader 
                title="Users" 
                description="Manage your team members and their access levels" 
                searchValue={searchQuery} 
                onSearchChange={setSearchQuery} 
                searchPlaceholder="Search users..."
                showSearch
                primaryAction={{
                    label: "Add User",
                    icon: Plus,
                    onClick: () => setIsDialogOpen(true)
                }}
                toolbar={
                    <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading} className="gap-2">
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        Refresh List
                    </Button>
                }
            />

            <UserDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
                newUser={newUser} 
                setNewUser={setNewUser} 
                onSubmit={handleCreateUser} 
                roles={roles}
            />

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Team Directory</CardTitle>
                    <CardDescription>A list of all users in your organization.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable users={filteredUsers} loading={loading} onDelete={handleDeleteUser} />
                </CardContent>
            </Card>
        </div>
    );
};

export default UsersPage;

