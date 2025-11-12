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
import { Progress } from "@/components/ui/progress";
import { Plus, FolderKanban, CheckCircle2, Clock, AlertCircle, Eye, Edit, Trash2, FileSpreadsheet, FileDown, ArrowUpRight, ArrowDownRight, Search, Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { exportToPDF, exportToExcel, exportSingleRecordPDF } from "@/lib/pdfExport";

const stats = [
  { title: "Total Projects", value: "24", change: "+3", trend: "up", icon: FolderKanban, color: "text-success", bgColor: "bg-blue-500/10" },
  { title: "Completed", value: "18", change: "+5", trend: "up", icon: CheckCircle2, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "In Progress", value: "5", change: "-2", trend: "down", icon: Clock, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Overdue", value: "1", change: "-1", trend: "down", icon: AlertCircle, color: "text-destructive", bgColor: "bg-red-500/10" },
  { title: "Team Members", value: "42", change: "+6", trend: "up", icon: Users, color: "text-primary", bgColor: "bg-purple-500/10" },
  { title: "Budget Used", value: "Rs 45M", change: "+12%", trend: "up", icon: DollarSign, color: "text-success", bgColor: "bg-pink-500/10" },
];

const projectStatusData = [
  { name: "Completed", value: 18, color: "hsl(142, 76%, 36%)" },
  { name: "In Progress", value: 5, color: "hsl(48, 96%, 53%)" },
  { name: "Overdue", value: 1, color: "hsl(0, 84%, 60%)" },
];

const monthlyProgressData = [
  { month: "Jan", completed: 2, started: 3 },
  { month: "Feb", completed: 3, started: 2 },
  { month: "Mar", completed: 4, started: 4 },
  { month: "Apr", completed: 3, started: 3 },
  { month: "May", completed: 4, started: 2 },
  { month: "Jun", completed: 2, started: 1 },
];

const budgetData = [
  { category: "Development", budget: 18000000 },
  { category: "Design", budget: 8500000 },
  { category: "Marketing", budget: 12000000 },
  { category: "Infrastructure", budget: 6500000 },
];

const initialProjects = [
  { id: "PRJ-001", name: "Website Redesign", client: "Karachi Corporation", budget: "Rs 2,500,000", team: 5, progress: 75, startDate: "2023-11-01", deadline: "2024-02-15", status: "in-progress" },
  { id: "PRJ-002", name: "Mobile App Development", client: "Lahore Tech Solutions", budget: "Rs 4,200,000", team: 8, progress: 100, startDate: "2023-09-15", deadline: "2024-01-30", status: "completed" },
  { id: "PRJ-003", name: "ERP Implementation", client: "Islamabad Industries", budget: "Rs 8,500,000", team: 12, progress: 45, startDate: "2023-12-01", deadline: "2024-03-20", status: "in-progress" },
  { id: "PRJ-004", name: "Cloud Migration", client: "Faisalabad Systems", budget: "Rs 3,200,000", team: 6, progress: 30, startDate: "2023-10-10", deadline: "2024-01-10", status: "overdue" },
  { id: "PRJ-005", name: "Data Analytics Platform", client: "Rawalpindi Media", budget: "Rs 5,800,000", team: 9, progress: 60, startDate: "2023-11-20", deadline: "2024-02-28", status: "in-progress" },
  { id: "PRJ-006", name: "CRM System", client: "Multan Enterprises", budget: "Rs 3,800,000", team: 7, progress: 100, startDate: "2023-08-01", deadline: "2024-01-15", status: "completed" },
  { id: "PRJ-007", name: "E-commerce Platform", client: "Peshawar Retail", budget: "Rs 6,500,000", team: 10, progress: 85, startDate: "2023-10-15", deadline: "2024-02-20", status: "in-progress" },
  { id: "PRJ-008", name: "Inventory Management", client: "Quetta Logistics", budget: "Rs 2,800,000", team: 5, progress: 100, startDate: "2023-09-01", deadline: "2024-01-10", status: "completed" },
  { id: "PRJ-009", name: "HR Portal", client: "Sialkot Industries", budget: "Rs 3,500,000", team: 6, progress: 55, startDate: "2023-12-10", deadline: "2024-03-15", status: "in-progress" },
  { id: "PRJ-010", name: "Payment Gateway", client: "Gujranwala Fintech", budget: "Rs 4,800,000", team: 8, progress: 70, startDate: "2023-11-05", deadline: "2024-02-25", status: "in-progress" },
];

interface Project {
  id: string;
  name: string;
  client: string;
  budget: string;
  team: number;
  progress: number;
  startDate: string;
  deadline: string;
  status: string;
}

export default function Projects() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    if (!name || !client || !deadline) {
      showError("Please fill all required fields");
      return;
    }

    const prog = parseInt(progress) || 0;
    const status = prog === 100 ? "completed" : "in-progress";

    if (editingId) {
      setProjects(projects.map(proj => 
        proj.id === editingId 
          ? { ...proj, name, client, deadline, progress: prog, status }
          : proj
      ));
      showSuccess("Project updated successfully!");
    } else {
      const newProject = {
        id: `PRJ-${Date.now().toString().slice(-6)}`,
        name,
        client,
        budget: "Rs 0",
        team: 0,
        progress: prog,
        startDate: new Date().toISOString().split('T')[0],
        deadline,
        status
      };
      setProjects([newProject, ...projects]);
      showSuccess("Project created successfully!");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setName(project.name);
    setClient(project.client);
    setDeadline(project.deadline);
    setProgress(project.progress.toString());
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(proj => proj.id !== id));
      showSuccess("Project deleted successfully!");
    }
  };

  const resetForm = () => {
    setName("");
    setClient("");
    setDeadline("");
    setProgress("0");
    setEditingId(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      completed: { variant: "default", label: "Completed" },
      "in-progress": { variant: "secondary", label: "In Progress" },
      overdue: { variant: "destructive", label: "Overdue" },
    };
    const config = variants[status] || variants["in-progress"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track projects, tasks, time, and budgets
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Project" : "Create New Project"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name *</Label>
                  <Input id="project-name" placeholder="Enter project name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client *</Label>
                    <select
                      id="client"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select client</option>
                      <option value="Karachi Corporation">Karachi Corporation</option>
                      <option value="Lahore Tech Solutions">Lahore Tech Solutions</option>
                      <option value="Islamabad Industries">Islamabad Industries</option>
                      <option value="Faisalabad Systems">Faisalabad Systems</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline *</Label>
                    <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input id="budget" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-manager">Project Manager</Label>
                    <Select>
                      <SelectTrigger id="project-manager">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmed">Ahmed Khan</SelectItem>
                        <SelectItem value="fatima">Fatima Ali</SelectItem>
                        <SelectItem value="hassan">Hassan Raza</SelectItem>
                        <SelectItem value="ayesha">Ayesha Malik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Project description..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input id="progress" type="number" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="0" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <Button className="bg-gradient-primary" onClick={handleCreate}>
                    {editingId ? "Update Project" : "Create Project"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
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

        {/* Projects Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="w-16" />
                          <span className="text-sm text-muted-foreground">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{project.deadline}</TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(project)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(project.id)}>
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
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{project.id}</p>
                      <p className="text-base font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.client}</p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-sm font-semibold">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="w-full" />
                    <div className="flex justify-between text-sm pt-2">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="font-medium">{project.deadline}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(project)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
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
