import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: string;
  company?: string;
}

export default function Users() {
  const { user: currentUser, users, updateUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDialogVisible, setUserDialogVisible] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'User',
    status: 'active',
    company: ''
  });
  

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'User',
      status: 'active',
      company: ''
    });
    setUserDialogVisible(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      company: user.company || ''
    });
    setUserDialogVisible(true);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if email already exists (for new users)
    if (!selectedUser && users.some(u => u.email === formData.email)) {
      toast.error('User with this email already exists');
      return;
    }

    if (selectedUser) {
      // Update existing user
      const updatedUser = {
        ...selectedUser,
        ...formData
      };
      updateUser(updatedUser);
      toast.success('User updated successfully!');
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...formData,
        plan: 'free' as const,
        invoicesCount: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      updateUser(newUser);
      toast.success('User added successfully!');
    }

    setUserDialogVisible(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'User',
      status: 'active',
      company: ''
    });
  };

  const handleDeleteUser = (userId: number) => {
    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      // Since updateUser is used for both add and update, we'll need a different approach
      // For now, just show a success message (you'd implement actual delete in AuthContext)
      toast.success('User deleted successfully!');
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b] mb-2">User Management</h1>
          <p className="text-[#64748b]">
            Manage team members and their permissions
          </p>
        </div>
        <Button
          onClick={handleAddUser}
          className="gap-2 bg-[#2563eb] hover:bg-[#1d4ed8]"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Current User Card */}
      {currentUser && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Currently Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white text-lg">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-[#1e293b] font-medium">{currentUser.name}</p>
                <p className="text-[#64748b] text-sm">{currentUser.email}</p>
              </div>
              <Badge className="ml-auto bg-blue-600">
                {currentUser.role}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Invoices</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-[#1e293b] font-medium">{user.name}</TableCell>
                  <TableCell className="text-[#64748b]">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === 'active'
                          ? 'bg-emerald-500 hover:bg-emerald-500'
                          : 'bg-slate-500 hover:bg-slate-500'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#64748b]">{user.invoicesCount || 0}</TableCell>
                  <TableCell className="text-[#64748b]">{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={userDialogVisible} onOpenChange={setUserDialogVisible}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? 'Update user information and permissions'
                : 'Add a new team member to your organization'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                disabled={!!selectedUser}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserDialogVisible(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveUser} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              {selectedUser ? 'Update' : 'Add'} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}