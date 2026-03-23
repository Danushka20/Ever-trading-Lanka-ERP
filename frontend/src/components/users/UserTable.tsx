import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Mail, Shield, MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from "@/components/ui/badge";

interface User {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
}

interface UserTableProps {
    users: User[];
    loading: boolean;
    onDelete: (id: number) => void;
}

const getRoleBadge = (roleName: string) => {
    switch (roleName.toLowerCase()) {
        case "admin":
            return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 uppercase text-[10px] font-bold">Admin</Badge>;
        case "manager":
            return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 uppercase text-[10px] font-bold">Manager</Badge>;
        default:
            return <Badge variant="secondary" className="uppercase text-[10px] font-bold">User</Badge>;
    }
};

export function UserTable({ users, loading, onDelete }: UserTableProps) {
    return (
        <div className="rounded-md border border-slate-100 overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="w-[250px]">User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Manage</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={4} className="h-16 text-center text-muted-foreground animate-pulse">Loading...</TableCell>
                            </TableRow>
                        ))
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No users found.</TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                            <UserIcon className="h-5 w-5" />
                                        </div>
                                        <div>{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Mail className="h-3.5 w-3.5" />
                                        {user.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-3.5 w-3.5 text-slate-400" />
                                        {user.roles.map(r => (
                                            <div key={r.id}>{getRoleBadge(r.name)}</div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer">Edit Profile</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">Change Password</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                                onClick={() => onDelete(user.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
