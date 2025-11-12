import { useState } from "react";
import { showSuccess, showError } from "@/lib/toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Users, Shield, UserCog, User, Eye, Edit, Trash2, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { title: "Total Users", value: "48", change: "+5", trend: "up", icon: Users, color: "text-success", bgColor: "bg-blue-500/10" },
  { title: "Super Admins", value: "2", change: "+0", trend: "up", icon: Shield, color: "text-primary", bgColor: "bg-purple-500/10" },
  { title: "Tenant Admins", value: "5", change: "+1", trend: "up", icon: UserCog, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Managers", value: "12", change: "+2", trend: "up", icon: UserCog, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Employees", value: "29", change: "+2", trend: "up", icon: User, color: "text-primary", bgColor: "bg-pink-500/10" },
  { title: "Active Sessions", value: "34", change: "+8", trend: "up", icon: Users, color: "text-success", bgColor: "bg-orange-500/10" },
];

const rolePermissions = {
  "super-admin": { label: "Super Admin", color: "destructive", description: "Full system access across all tenants" },
  "tenant-admin": { label: "Tenant Admin", color: "default", description: "Full access within tenant" },
  "manager": { label: "Manager", color: "secondary", description: "Department management access" },
  "employee": { label: "Employee", color: "outline", description: "Basic access to assigned modules" }
};

const modulePermissions = [
  { id: "sales", name: "Sales" },
  { id: "purchase", name: "Purchase" },
  { id: "inventory", name: "Inventory" },
  { id: "crm", name: "CRM" },
  { id: "hr", name: "HR" },
  { id: "projects", name: "Projects" },
  { id: "accounting", name: "Accounting" },
  { id: "reports", name: "Reports" },
];

const initialUsers = [
  { id: "USR-001", name: "Ahmed Khan", email: "ahmed@erpmax.pk", phone: "+92 300 1234567", role: "super-admin", status: "active", tenant: "ErpMax Pakistan", lastLogin: "2024-01-15 10:30 AM", createdAt: "2023-01-01", modules: ["all"] },
  { id: "USR-002", name: "Fatima Ali", email: "fatima@erpmax.pk", phone: "+92 321 7654321", role: "tenant-admin", status: "active", tenant: "ErpMax Pakistan", lastLogin: "2024-01-15 09:15 AM", createdAt: "2023-02-15", modules: ["all"] },
  { id: "USR-003", name: "Hassan Raza", email: "hassan@erpmax.pk", phone: "+92 333 9876543", role: "manager", status: "active", tenant: "ErpMax Pakistan", lastLogin: "2024-01-15 08:45 AM", createdAt: "2023-03-20", modules: ["sales", "crm", "reports"] },
  { id: "USR-004", name: "Ayesha Malik", email: "ayesha@erpmax.pk", phone: "+92 345 1122334", role: "manager", status: "active", tenant: "ErpMax Pakistan", lastLogin: "2024-01-14 05:30 PM", createdAt: "2023-04-10", modules: ["hr", "accounting", "reports"] },
  { id: "USR-005", name: "Usman Tariq", email: "usman@erpmax.pk", phone: "+92 300 5566778", role: "employee", status: "active", tenant: "ErpMax Pakistan", lastLogin: "2024-01-15 09:00 AM", createdAt: "2023-05-15", modules: ["sales", "inventory"] },
  { id: "USR-006", name: "Sara Noor", email: "sara@erpmax.pk", phone: "+92 321 4455667", role: "employee", status: "active", tenant: "ErpMax Pakistan", lastLogin: "2024-01-15 08:30 AM", createdAt: "2023-06-20", modules: ["purchase", "inventory"] },
  { id: "USR-007", name: "Ali Hassan", email: "ali@erpmax.pk", phone: "+92 333 7788990", role: "employee", status: "inactive", tenant: "ErpMax Pakistan", lastLogin: "2024-01-10 03:20 PM", createdAt: "2023-07-05", modules: ["crm"] },
];

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  tenant: string;
  lastLogin: string;
  createdAt: string;
  modules: string[];
}

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleModuleToggle = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(m => m !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };

  const handleCreate = () => {
    if (!name || !email || !role) {
      showError("Please fill all required fields");
      return;
    }

    if (editingId) {
      setUsers(users.map(user => 
        user.id === editingId 
          ? { ...user, name, email, phone, role, modules: selectedModules }
          : user
      ));
      showSuccess("User updated successfully!");
    } else {
      const newUser = {
        id: `USR-${Date.now().toString().slice(-6)}`,
        name,
        email,
        phone,
        role,
        status: "active",
        tenant: "ErpMax Pakistan",
        lastLogin: "Never",
        createdAt: new Date().toISOString().split('T')[0],
        modules: selectedModules
      };
      setUsers([newUser, ...users]);
      showSuccess("User created successfully!");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
    setSelectedModules(user.modules);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
      showSuccess("User deleted successfully!");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRole("");
    setSelectedModules([]);
    setEditingId(null);
  };

  const getRoleBadge = (role: string) => {
    const config = rolePermissions[role as keyof typeof rolePermissions] || rolePermissions.employee;
    return <Badge variant={config.color as "default" | "secondary" | "destructive" | "outline"}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <Badge variant="default">Active</Badge>
      : <Badge variant="destructive">Inactive</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit User" : "Add New User"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name *</Label>
                    <Input id="user-name" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email *</Label>
                    <Input id="user-email" type="email" placeholder="user@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-phone">Phone Number</Label>
                    <Input id="user-phone" placeholder="+92 300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role *</Label>
                    <select
                      id="user-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select role</option>
                      <option value="super-admin">Super Admin</option>
                      <option value="tenant-admin">Tenant Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  </div>
                </div>

                {role && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Role Permissions</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {rolePermissions[role as keyof typeof rolePermissions]?.description}
                    </p>
                  </div>
                )}

                {role && role !== "super-admin" && role !== "tenant-admin" && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <Label>Module Access</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {modulePermissions.map((module) => (
                          <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">{module.name}</span>
                            <Switch
                              checked={selectedModules.includes(module.id)}
                              onCheckedChange={() => handleModuleToggle(module.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <Button className="bg-gradient-primary" onClick={handleCreate}>
                    {editingId ? "Update User" : "Create User"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Users</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="super-admin">Super Admin</option>
                    <option value="tenant-admin">Tenant Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                    <TableHead className="font-semibold">User ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Login</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-primary">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View" className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(user)} className="hover:bg-blue-500/10">
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(user.id)} className="hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-3">
              {paginatedUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-primary">{user.id}</p>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {getStatusBadge(user.status)}
                  </div>
                  <div>{getRoleBadge(user.role)}</div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length > itemsPerPage && (
              <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
