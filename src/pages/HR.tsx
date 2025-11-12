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
import { Plus, Users, UserCheck, UserX, DollarSign, Eye, Edit, Trash2, FileSpreadsheet, FileDown, ArrowUpRight, ArrowDownRight, Search, Calendar, Briefcase, Mail, Phone, MessageSquare, Link2, Printer, Share2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { exportToPDF, exportToExcel, exportSingleRecordPDF } from "@/lib/pdfExport";

const stats = [
  { title: "Total Employees", value: "156", change: "+8", trend: "up", icon: Users, color: "text-success", bgColor: "bg-blue-500/10" },
  { title: "Present Today", value: "142", change: "+2", trend: "up", icon: UserCheck, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "On Leave", value: "14", change: "-3", trend: "down", icon: UserX, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Payroll (Month)", value: "Rs 24.5M", change: "+5.2%", trend: "up", icon: DollarSign, color: "text-success", bgColor: "bg-purple-500/10" },
  { title: "New Hires", value: "8", change: "+8", trend: "up", icon: UserCheck, color: "text-success", bgColor: "bg-pink-500/10" },
  { title: "Avg Salary", value: "Rs 157K", change: "+3.8%", trend: "up", icon: DollarSign, color: "text-success", bgColor: "bg-orange-500/10" },
];

const departmentData = [
  { name: "IT", employees: 45, color: "hsl(var(--primary))" },
  { name: "Sales", employees: 38, color: "hsl(142, 76%, 36%)" },
  { name: "Marketing", employees: 28, color: "hsl(48, 96%, 53%)" },
  { name: "Finance", employees: 22, color: "hsl(221, 83%, 53%)" },
  { name: "HR", employees: 12, color: "hsl(280, 83%, 53%)" },
  { name: "Operations", employees: 11, color: "hsl(24, 95%, 53%)" },
];

const attendanceData = [
  { month: "Jan", present: 148, absent: 8 },
  { month: "Feb", present: 152, absent: 4 },
  { month: "Mar", present: 145, absent: 11 },
  { month: "Apr", present: 150, absent: 6 },
  { month: "May", present: 147, absent: 9 },
  { month: "Jun", present: 142, absent: 14 },
];

const salaryDistribution = [
  { range: "50K-100K", count: 42 },
  { range: "100K-150K", count: 58 },
  { range: "150K-200K", count: 35 },
  { range: "200K+", count: 21 },
];

const initialEmployees = [
  { id: "EMP-001", name: "Ahmed Khan", position: "Software Engineer", department: "IT", email: "ahmed@company.com", phone: "+92 300 1234567", salary: "Rs 150,000", joinDate: "2022-01-15", status: "active" },
  { id: "EMP-002", name: "Fatima Ali", position: "Marketing Manager", department: "Marketing", email: "fatima@company.com", phone: "+92 321 7654321", salary: "Rs 130,000", joinDate: "2021-06-20", status: "active" },
  { id: "EMP-003", name: "Hassan Raza", position: "Sales Executive", department: "Sales", email: "hassan@company.com", phone: "+92 333 9876543", salary: "Rs 100,000", joinDate: "2023-03-10", status: "active" },
  { id: "EMP-004", name: "Ayesha Malik", position: "HR Manager", department: "HR", email: "ayesha@company.com", phone: "+92 345 1122334", salary: "Rs 120,000", joinDate: "2020-09-05", status: "on-leave" },
  { id: "EMP-005", name: "Usman Tariq", position: "Accountant", department: "Finance", email: "usman@company.com", phone: "+92 300 5566778", salary: "Rs 90,000", joinDate: "2022-11-12", status: "active" },
  { id: "EMP-006", name: "Sara Noor", position: "Product Manager", department: "IT", email: "sara@company.com", phone: "+92 321 4455667", salary: "Rs 180,000", joinDate: "2021-02-18", status: "active" },
  { id: "EMP-007", name: "Ali Hassan", position: "Sales Manager", department: "Sales", email: "ali@company.com", phone: "+92 333 7788990", salary: "Rs 160,000", joinDate: "2020-07-22", status: "active" },
  { id: "EMP-008", name: "Zainab Khan", position: "Content Writer", department: "Marketing", email: "zainab@company.com", phone: "+92 345 2233445", salary: "Rs 85,000", joinDate: "2023-01-08", status: "active" },
  { id: "EMP-009", name: "Bilal Ahmed", position: "DevOps Engineer", department: "IT", email: "bilal@company.com", phone: "+92 300 9988776", salary: "Rs 170,000", joinDate: "2021-10-15", status: "active" },
  { id: "EMP-010", name: "Maria Aslam", position: "Financial Analyst", department: "Finance", email: "maria@company.com", phone: "+92 321 6655443", salary: "Rs 110,000", joinDate: "2022-05-30", status: "active" },
];

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  salary: string;
  joinDate: string;
  status: string;
}

export default function HR() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState(initialEmployees);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
  };

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
        email: "",
        phone: "",
        salary: `Rs ${parseFloat(salary).toLocaleString('en-PK')}`,
        joinDate: new Date().toISOString().split('T')[0],
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

  const handleExportPDF = () => {
    const result = exportToPDF({
      title: 'HR Employees Report',
      columns: [
        { header: 'Employee ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'Position', key: 'position' },
        { header: 'Department', key: 'department' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phone' },
        { header: 'Salary', key: 'salary' },
        { header: 'Status', key: 'status', format: (val) => val.toUpperCase() }
      ],
      data: filteredEmployees,
      filename: 'hr_employees'
    });
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
  };

  const handleExportExcel = () => {
    const result = exportToExcel({
      columns: [
        { header: 'Employee ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'Position', key: 'position' },
        { header: 'Department', key: 'department' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phone' },
        { header: 'Salary', key: 'salary' },
        { header: 'Status', key: 'status' }
      ],
      data: filteredEmployees,
      filename: 'hr_employees'
    });
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Human Resources</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
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

        {/* Enhanced Stats */}
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
                  <span className="text-muted-foreground hidden lg:inline">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="employees"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="hsl(0, 84%, 60%)" strokeWidth={2} name="Absent" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Salary Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="range" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {employees.map((emp) => (
                <div key={emp.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{emp.id}</p>
                      <p className="text-base font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.position}</p>
                    </div>
                    {getStatusBadge(emp.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Department</p>
                      <p className="font-semibold">{emp.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Salary</p>
                      <p className="font-semibold">{emp.salary}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(emp)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
