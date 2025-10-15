import { ChevronDown, LogOut, Settings, User, CreditCard, Users, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Building2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

export default function Topbar() {
  const { user, users, logout, switchUser } = useAuth();
  const navigate = useNavigate();
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchUser = (userId: number) => {
    const result = switchUser(userId);
    if (result.success) {
      setSwitchAccountOpen(false);
      toast.success(`Switched to ${result.user?.name}`);
      window.location.reload(); // Refresh to update the UI
    } else {
      toast.error(result.error || 'Failed to switch user');
    }
  };

  return (
    <div className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
            <span className="text-white">E</span>
          </div>
          <span className="text-[#1e293b]">My E-lnvoice</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-slate-100 rounded-lg p-2 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} />
                <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-[#1e293b]">{user?.name || 'User'}</p>
                <p className="text-[#64748b] capitalize">{user?.role || 'User'}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#64748b]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                <Badge variant="outline" className="w-fit mt-1 capitalize">
                  {user?.plan || 'Free'} Plan
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/billing')}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSwitchAccountOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              <span>Switch Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Switch Account Dialog */}
      <Dialog open={switchAccountOpen} onOpenChange={setSwitchAccountOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Switch Account</DialogTitle>
            <DialogDescription>
              Select an account to switch to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {users.map((accountUser) => (
              <div
                key={accountUser.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  accountUser.id === user?.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'hover:bg-slate-100 border-2 border-transparent'
                }`}
                onClick={() => handleSwitchUser(accountUser.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${accountUser.name}`} />
                  <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white">
                    {accountUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-[#1e293b]">{accountUser.name}</p>
                  <p className="text-sm text-[#64748b]">{accountUser.email}</p>
                  <p className="text-xs text-[#64748b] capitalize">
                    {accountUser.role} • {accountUser.plan}
                  </p>
                </div>
                {accountUser.id === user?.id && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}