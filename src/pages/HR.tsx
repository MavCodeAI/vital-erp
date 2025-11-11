import { useState } from "react";
import { showSuccess, showError } from "@/lib/toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, UserCheck, UserX, DollarSign, Eye, Edit, Trash2 } from "lucide-react";

const stats = [
  { title: "Total Employees", value: "156", icon: Users, color: "text-primary" },
  { title: "Present Today", value: "142", icon: UserCheck, color: "text-success" },
  { title: "On Leave", value: "14", icon: UserX, color: "text-warning" },
  { title: "Payroll (Month)", value: "Rs 24,500,000", icon: DollarSign, color: "text-primary" },
];

const initialEmployees = [
  { id: "EMP-001", name: "Ahmed Khan", position: "Software Engineer", department: "IT", salary: "Rs 150,000", status: "active" },
  { id: "EMP-002", name: "Fatima Ali", position: "Marketing Manager", department: "Marketing", salary: "Rs 130,000", status: "active" },
  { id: "EMP-003", name: "Hassan Raza", position: "Sales Executive", department: "Sales", salary: "Rs 100,000", status: "active" },
  { id: "EMP-004", name: "Ayesha Malik", position: "HR Manager", department: "HR", salary: "Rs 120,000", status: "on-leave" },
  { id: "EMP-005", name: "Usman Tariq", position: "Accountant", department: "Finance", salary: "Rs 90,000", status: "active" },
];

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: string;
  status: string;
}

export default function HR() {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  const handleCreate = () => {
    if (!name || !position || !department || !salary) {
      showError("Please fill all required fields");
      return;
    }

    if (editingId) {
      setEmployees(employees.map(emp => 
        emp.id === editingId 
          ? { ...emp, name, position, department, salary: `Rs ${parseFloat(salary).toLocaleString('en-PK')}` }
          : emp
      ));
      showSuccess("Employee updated successfully!");
    } else {
      const newEmployee = {
        id: `EMP-${Date.now().toString().slice(-6)}`,
        name,
        position,
        department,
        salary: `Rs ${parseFloat(salary).toLocaleString('en-PK')}`,
        status: "active"
      };
      setEmployees([newEmployee, ...employees]);
      showSuccess("Employee added successfully!");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setName(emp.name);
    setPosition(emp.position);
    setDepartment(emp.department);
    setSalary(emp.salary.replace(/[^0-9.-]+/g, ""));
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
      showSuccess("Employee deleted successfully!");
    }
  };

  const resetForm = () => {
    setName("");
    setPosition("");
    setDepartment("");
    setSalary("");
    setEditingId(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      active: { variant: "default", label: "Active" },
      "on-leave": { variant: "secondary", label: "On Leave" },
      inactive: { variant: "destructive", label: "Inactive" },
    };
    const config = variants[status] || variants.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
            <p className="text-muted-foreground mt-1">
              Manage employees, attendance, leave, and payroll
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Employee" : "Add New Employee"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emp-name">Full Name *</Label>
                    <Input id="emp-name" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="employee@company.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input id="position" placeholder="Job title" value={position} onChange={(e) => setPosition(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select department</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="join-date">Join Date</Label>
                    <Input id="join-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (Rs) *</Label>
                    <Input id="salary" type="number" placeholder="0.00" value={salary} onChange={(e) => setSalary(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+92 300 1234567" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <Button className="bg-gradient-primary" onClick={handleCreate}>
                    {editingId ? "Update Employee" : "Add Employee"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employees Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.id}</TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.salary}</TableCell>
                      <TableCell>{getStatusBadge(emp.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(emp)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(emp.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
