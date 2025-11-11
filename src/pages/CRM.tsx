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
import { Plus, UserPlus, Target, TrendingUp, DollarSign, Eye, Edit, Trash2 } from "lucide-react";

const stats = [
  { title: "Total Leads", value: "342", icon: UserPlus, color: "text-primary" },
  { title: "Active Deals", value: "89", icon: Target, color: "text-primary" },
  { title: "Conversion Rate", value: "26%", icon: TrendingUp, color: "text-success" },
  { title: "Pipeline Value", value: "Rs 120M", icon: DollarSign, color: "text-success" },
];

const initialLeads = [
  { id: "LEAD-001", name: "Ali Raza", company: "Karachi Tech Hub", value: "Rs 4,500,000", stage: "qualified", source: "Website" },
  { id: "LEAD-002", name: "Sana Ahmed", company: "Lahore Retail", value: "Rs 3,200,000", stage: "proposal", source: "Referral" },
  { id: "LEAD-003", name: "Bilal Khan", company: "Pakistan Finance", value: "Rs 7,800,000", stage: "negotiation", source: "Cold Call" },
  { id: "LEAD-004", name: "Zainab Malik", company: "Islamabad Healthcare", value: "Rs 2,500,000", stage: "new", source: "LinkedIn" },
  { id: "LEAD-005", name: "Imran Sheikh", company: "Faisalabad Manufacturing", value: "Rs 9,500,000", stage: "won", source: "Trade Show" },
];

interface Lead {
  id: string;
  name: string;
  company: string;
  value: string;
  stage: string;
  source: string;
}

export default function CRM() {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState(initialLeads);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("");
  const [source, setSource] = useState("");

  const handleCreate = () => {
    if (!name || !company || !value) {
      showError("Please fill all required fields");
      return;
    }

    if (editingId) {
      setLeads(leads.map(lead => 
        lead.id === editingId 
          ? { ...lead, name, company, value: `Rs ${parseFloat(value).toLocaleString('en-PK')}`, source }
          : lead
      ));
      showSuccess("Lead updated successfully!");
    } else {
      const newLead = {
        id: `LEAD-${Date.now().toString().slice(-6)}`,
        name,
        company,
        value: `Rs ${parseFloat(value).toLocaleString('en-PK')}`,
        stage: "new",
        source: source || "Website"
      };
      setLeads([newLead, ...leads]);
      showSuccess("Lead added successfully!");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setName(lead.name);
    setCompany(lead.company);
    setValue(lead.value.replace(/[^0-9.-]+/g, ""));
    setSource(lead.source);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      setLeads(leads.filter(lead => lead.id !== id));
      showSuccess("Lead deleted successfully!");
    }
  };

  const resetForm = () => {
    setName("");
    setCompany("");
    setValue("");
    setSource("");
    setEditingId(null);
  };

  const getStageBadge = (stage: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      new: { variant: "outline", label: "New" },
      qualified: { variant: "secondary", label: "Qualified" },
      proposal: { variant: "secondary", label: "Proposal" },
      negotiation: { variant: "secondary", label: "Negotiation" },
      won: { variant: "default", label: "Won" },
      lost: { variant: "destructive", label: "Lost" },
    };
    const config = variants[stage] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">CRM</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage leads, deals, and customer relationships
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Lead" : "Add New Lead"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lead-name">Contact Name *</Label>
                    <Input id="lead-name" placeholder="Enter contact name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input id="company" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lead-email">Email</Label>
                    <Input id="lead-email" type="email" placeholder="contact@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead-phone">Phone</Label>
                    <Input id="lead-phone" placeholder="+92 300 1234567" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deal-value">Deal Value (Rs) *</Label>
                    <Input id="deal-value" type="number" placeholder="0.00" value={value} onChange={(e) => setValue(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <select
                      id="source"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select source</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Cold Call">Cold Call</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Additional notes..." />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <Button className="bg-gradient-primary" onClick={handleCreate}>
                    {editingId ? "Update Lead" : "Add Lead"}
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

        {/* Leads Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.id}</TableCell>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>{lead.value}</TableCell>
                      <TableCell>{getStageBadge(lead.stage)}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(lead)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(lead.id)}>
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
              {leads.map((lead) => (
                <div key={lead.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{lead.id}</p>
                      <p className="text-base font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                    {getStageBadge(lead.stage)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Value</p>
                      <p className="font-bold text-base">{lead.value}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Source</p>
                      <p className="font-semibold">{lead.source}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(lead)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)}>
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
