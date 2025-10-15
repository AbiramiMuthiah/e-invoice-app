import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Settings, Shield, Database, Activity } from 'lucide-react';

export default function Admin() {
  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      <div>
        <h1 className="text-[#1e293b] mb-2">Admin Settings</h1>
        <p className="text-[#64748b]">
          System configuration and administration tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>System Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[#64748b]">
              Configure system-wide settings and preferences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[#64748b]">
              Manage security settings and access controls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Database className="h-5 w-5 text-violet-600" />
              </div>
              <CardTitle>Data Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[#64748b]">
              Backup, restore, and manage application data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
              <CardTitle>System Logs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[#64748b]">
              View system activity and audit logs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
