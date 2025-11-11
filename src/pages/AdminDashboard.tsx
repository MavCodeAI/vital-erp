import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/lib/toast";
import { Shield, Users, Activity, AlertTriangle, LogOut, Search, ArrowUpRight, ArrowDownRight, MapPin, Clock, Monitor } from "lucide-react";

const stats = [
  { title: "Active Sessions", value: "34", change: "+8", trend: "up", icon: Users, color: "text-success", bgColor: "bg-blue-500/10" },
  { title: "Total Users Online", value: "28", change: "+5", trend: "up", icon: Activity, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Security Alerts", value: "3", change: "+2", trend: "up", icon: AlertTriangle, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Failed Logins (24h)", value: "12", change: "-4", trend: "down", icon: Shield, color: "text-destructive", bgColor: "bg-red-500/10" },
];

const initialSessions = [
  {
    id: "SES-001",
    user: "Ahmed Khan",
    email: "ahmed@erpmax.pk",
    role: "Super Admin",
    ipAddress: "192.168.1.100",
    location: "Karachi, Pakistan",
    device: "Chrome on Windows",
    loginTime: "2024-01-15 10:30 AM",
    lastActivity: "2 minutes ago",
    status: "active"
  },
  {
    id: "SES-002",
    user: "Fatima Ali",
    email: "fatima@erpmax.pk",
    role: "Tenant Admin",
    ipAddress: "192.168.1.101",
    location: "Lahore, Pakistan",
    device: "Safari on MacOS",
    loginTime: "2024-01-15 09:15 AM",
    lastActivity: "5 minutes ago",
    status: "active"
  },
  {
    id: "SES-003",
    user: "Hassan Raza",
    email: "hassan@erpmax.pk",
    role: "Manager",
    ipAddress: "192.168.1.102",
    location: "Islamabad, Pakistan",
    device: "Firefox on Linux",
    loginTime: "2024-01-15 08:45 AM",
    lastActivity: "15 minutes ago",
    status: "active"
  },
  {
    id: "SES-004",
    user: "Ayesha Malik",
    email: "ayesha@erpmax.pk",
    role: "Manager",
    ipAddress: "192.168.1.103",
    location: "Faisalabad, Pakistan",
    device: "Chrome on Android",
    loginTime: "2024-01-14 05:30 PM",
    lastActivity: "45 minutes ago",
    status: "idle"
  },
  {
    id: "SES-005",
    user: "Usman Tariq",
    email: "usman@erpmax.pk",
    role: "Employee",
    ipAddress: "192.168.1.104",
    location: "Multan, Pakistan",
    device: "Edge on Windows",
    loginTime: "2024-01-15 09:00 AM",
    lastActivity: "1 hour ago",
    status: "idle"
  },
];

const securityAlerts = [
  {
    id: "ALT-001",
    type: "suspicious",
    severity: "high",
    message: "Multiple failed login attempts from IP 203.0.113.45",
    user: "Unknown",
    timestamp: "2024-01-15 11:20 AM",
    action: "IP Blocked"
  },
  {
    id: "ALT-002",
    type: "warning",
    severity: "medium",
    message: "Login from new device detected",
    user: "Sara Noor",
    timestamp: "2024-01-15 10:45 AM",
    action: "Email Sent"
  },
  {
    id: "ALT-003",
    type: "info",
    severity: "low",
    message: "Password changed successfully",
    user: "Ali Hassan",
    timestamp: "2024-01-15 09:30 AM",
    action: "Logged"
  },
];

interface Session {
  id: string;
  user: string;
  email: string;
  role: string;
  ipAddress: string;
  location: string;
  device: string;
  loginTime: string;
  lastActivity: string;
  status: string;
}

export default function AdminDashboard() {
  const [sessions, setSessions] = useState(initialSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         session.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.ipAddress.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleForceLogout = (sessionId: string, userName: string) => {
    if (confirm(`Are you sure you want to force logout ${userName}?`)) {
      setSessions(sessions.filter(s => s.id !== sessionId));
      showSuccess(`${userName} has been logged out successfully!`);
    }
  };

  const handleLogoutAll = () => {
    if (confirm("Are you sure you want to logout all users? This will affect all active sessions.")) {
      setSessions([]);
      showSuccess("All users have been logged out!");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Active" },
      idle: { variant: "secondary" as const, label: "Idle" },
      expired: { variant: "destructive" as const, label: "Expired" }
    };
    const config = variants[status as keyof typeof variants] || variants.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: { variant: "destructive" as const, label: "High" },
      medium: { variant: "secondary" as const, label: "Medium" },
      low: { variant: "outline" as const, label: "Low" }
    };
    const config = variants[severity as keyof typeof variants] || variants.low;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Monitor user sessions and security alerts
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogoutAll}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout All Users
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-soft hover:shadow-elevated transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl xl:text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className={`h-3 w-3 ${stat.color}`} />
                  ) : (
                    <ArrowDownRight className={`h-3 w-3 ${stat.color}`} />
                  )}
                  <span className={stat.color}>{stat.change}</span>
                  <span className="text-muted-foreground">today</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Alerts */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <CardTitle>Recent Security Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>User: {alert.user}</span>
                      <span>Action: {alert.action}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Active Sessions</CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sessions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="idle">Idle</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Device</TableHead>
                    <TableHead className="font-semibold">Last Activity</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                    <TableRow key={session.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium">{session.user}</p>
                          <p className="text-xs text-muted-foreground">{session.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{session.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{session.ipAddress}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Monitor className="h-3 w-3 text-muted-foreground" />
                          <span>{session.device}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{session.lastActivity}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleForceLogout(session.id, session.user)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Force Logout
                        </Button>
                      </TableCell>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No active sessions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {filteredSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.user}</p>
                      <p className="text-xs text-muted-foreground">{session.email}</p>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Monitor className="h-3 w-3" />
                      <span>{session.device}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{session.lastActivity}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleForceLogout(session.id, session.user)}
                    className="w-full text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Force Logout
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
