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
import { Plus, FolderKanban, CheckCircle2, Clock, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";

const stats = [
  { title: "Total Projects", value: "24", icon: FolderKanban, color: "text-primary" },
  { title: "Completed", value: "18", icon: CheckCircle2, color: "text-success" },
  { title: "In Progress", value: "5", icon: Clock, color: "text-warning" },
  { title: "Overdue", value: "1", icon: AlertCircle, color: "text-destructive" },
];

const initialProjects = [
  { id: "PRJ-001", name: "Website Redesign", client: "Karachi Corporation", progress: 75, deadline: "2024-02-15", status: "in-progress" },
  { id: "PRJ-002", name: "Mobile App Development", client: "Lahore Tech Solutions", progress: 100, deadline: "2024-01-30", status: "completed" },
  { id: "PRJ-003", name: "ERP Implementation", client: "Islamabad Industries", progress: 45, deadline: "2024-03-20", status: "in-progress" },
  { id: "PRJ-004", name: "Cloud Migration", client: "Faisalabad Systems", progress: 30, deadline: "2024-01-10", status: "overdue" },
  { id: "PRJ-005", name: "Data Analytics Platform", client: "Rawalpindi Media", progress: 60, deadline: "2024-02-28", status: "in-progress" },
];

interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  deadline: string;
  status: string;
}

export default function Projects() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState("0");

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
        progress: prog,
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
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">
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

        {/* Projects Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
