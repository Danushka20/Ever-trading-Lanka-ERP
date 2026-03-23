import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    newUser: any;
    setNewUser: (user: any) => void;
    onSubmit: () => void;
    roles?: any[];
}

export function UserDialog({ open, onOpenChange, newUser, setNewUser, onSubmit, roles = [] }: UserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>Fill in the details below to add a new team member.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">System Role</Label>
                        <Select defaultValue="user" onValueChange={(val) => setNewUser({...newUser, roles: [val]})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.length > 0 ? (
                                    roles.map((role: any) => (
                                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                    ))
                                ) : (
                                    <>
                                        <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                                        <SelectItem value="admin">Administrator</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="salesperson">Salesperson</SelectItem>
                                        <SelectItem value="user">Standard User</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={onSubmit}>Create Account</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
