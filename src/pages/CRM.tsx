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
import { Plus, UserPlus, Target, TrendingUp, DollarSign, Eye, Edit, Trash2, FileSpreadsheet, FileDown, ArrowUpRight, ArrowDownRight, Search, Users, Phone, Mail, MessageSquare, Link2, Printer, Share2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area, FunnelChart, Funnel, LabelList } from "recharts";
import { exportToPDF, exportToExcel, exportSingleRecordPDF } from "@/lib/pdfExport";

const stats = [
  { title: "Total Leads", value: "342", change: "+28", trend: "up", icon: UserPlus, color: "text-success", bgColor: "bg-blue-500/10" },
  { title: "Active Deals", value: "89", change: "+12", trend: "up", icon: Target, color: "text-primary", bgColor: "bg-purple-500/10" },
  { title: "Conversion Rate", value: "26%", change: "+3.2%", trend: "up", icon: TrendingUp, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Pipeline Value", value: "Rs 120M", change: "+15.8%", trend: "up", icon: DollarSign, color: "text-success", bgColor: "bg-yellow-500/10" },
  { title: "Won Deals", value: "64", change: "+8", trend: "up", icon: Target, color: "text-success", bgColor: "bg-pink-500/10" },
  { title: "Avg Deal Size", value: "Rs 3.5M", change: "+5.2%", trend: "up", icon: DollarSign, color: "text-success", bgColor: "bg-orange-500/10" },
];

const salesFunnelData = [
  { stage: "New", value: 150, fill: "hsl(var(--primary))" },
  { stage: "Qualified", value: 98, fill: "hsl(142, 76%, 36%)" },
  { stage: "Proposal", value: 65, fill: "hsl(48, 96%, 53%)" },
  { stage: "Negotiation", value: 42, fill: "hsl(24, 95%, 53%)" },
  { stage: "Won", value: 28, fill: "hsl(142, 76%, 36%)" },
];

const leadSourceData = [
  { name: "Website", value: 120, color: "hsl(var(--primary))" },
  { name: "Referral", value: 85, color: "hsl(142, 76%, 36%)" },
  { name: "Cold Call", value: 65, color: "hsl(48, 96%, 53%)" },
  { name: "LinkedIn", value: 45, color: "hsl(221, 83%, 53%)" },
  { name: "Trade Show", value: 27, color: "hsl(280, 83%, 53%)" },
];

const monthlyConversionData = [
  { month: "Jan", leads: 45, converted: 12 },
  { month: "Feb", leads: 52, converted: 14 },
  { month: "Mar", leads: 48, converted: 13 },
  { month: "Apr", leads: 65, converted: 18 },
  { month: "May", leads: 58, converted: 16 },
  { month: "Jun", leads: 74, converted: 21 },
];

const initialLeads = [
  { id: "LEAD-001", name: "Ali Raza", company: "Karachi Tech Hub", email: "ali@karachitech.com", phone: "+92 300 1234567", value: "Rs 4,500,000", stage: "qualified", source: "Website", lastContact: "2024-01-15" },
  { id: "LEAD-002", name: "Sana Ahmed", company: "Lahore Retail", email: "sana@lahoreretail.com", phone: "+92 321 7654321", value: "Rs 3,200,000", stage: "proposal", source: "Referral", lastContact: "2024-01-14" },
  { id: "LEAD-003", name: "Bilal Khan", company: "Pakistan Finance", email: "bilal@pkfinance.com", phone: "+92 333 9876543", value: "Rs 7,800,000", stage: "negotiation", source: "Cold Call", lastContact: "2024-01-13" },
  { id: "LEAD-004", name: "Zainab Malik", company: "Islamabad Healthcare", email: "zainab@isb-health.com", phone: "+92 345 1122334", value: "Rs 2,500,000", stage: "new", source: "LinkedIn", lastContact: "2024-01-12" },
  { id: "LEAD-005", name: "Imran Sheikh", company: "Faisalabad Manufacturing", email: "imran@fsd-mfg.com", phone: "+92 300 5566778", value: "Rs 9,500,000", stage: "won", source: "Trade Show", lastContact: "2024-01-11" },
  { id: "LEAD-006", name: "Fatima Noor", company: "Multan Textiles", email: "fatima@multantex.com", phone: "+92 321 4455667", value: "Rs 5,200,000", stage: "qualified", source: "Website", lastContact: "2024-01-10" },
  { id: "LEAD-007", name: "Ahmed Hassan", company: "Peshawar Trading", email: "ahmed@peshawartrade.com", phone: "+92 333 7788990", value: "Rs 3,800,000", stage: "proposal", source: "Referral", lastContact: "2024-01-09" },
  { id: "LEAD-008", name: "Ayesha Khan", company: "Quetta Mining", email: "ayesha@quettamine.com", phone: "+92 345 2233445", value: "Rs 6,500,000", stage: "new", source: "Cold Call", lastContact: "2024-01-08" },
  { id: "LEAD-009", name: "Hassan Ali", company: "Sialkot Sports", email: "hassan@sialkot-sports.com", phone: "+92 300 9988776", value: "Rs 4,100,000", stage: "negotiation", source: "LinkedIn", lastContact: "2024-01-07" },
  { id: "LEAD-010", name: "Maria Aslam", company: "Gujranwala Steel", email: "maria@gujsteel.com", phone: "+92 321 6655443", value: "Rs 8,200,000", stage: "won", source: "Trade Show", lastContact: "2024-01-06" },
];

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: string;
  stage: string;
  source: string;
  lastContact: string;
}

export default function CRM() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState(initialLeads);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("");
  const [source, setSource] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    return matchesSearch && matchesStage && matchesSource;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStageChange = (value: string) => {
    setStageFilter(value);
    setCurrentPage(1);
  };

  const handleSourceChange = (value: string) => {
    setSourceFilter(value);
    setCurrentPage(1);
  };

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
        email: "",
        phone: "",
        value: `Rs ${parseFloat(value).toLocaleString('en-PK')}`,
        stage: "new",
        source: source || "Website",
        lastContact: new Date().toISOString().split('T')[0]
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

  const handleExportPDF = () => {
    const result = exportToPDF({
      title: 'CRM Leads Report',
      columns: [
        { header: 'Lead ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'Company', key: 'company' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phone' },
        { header: 'Value', key: 'value' },
        { header: 'Stage', key: 'stage', format: (val) => val.toUpperCase() },
        { header: 'Source', key: 'source' }
      ],
      data: filteredLeads,
      filename: 'crm_leads'
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
        { header: 'Lead ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'Company', key: 'company' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phone' },
        { header: 'Value', key: 'value' },
        { header: 'Stage', key: 'stage' },
        { header: 'Source', key: 'source' }
      ],
      data: filteredLeads,
      filename: 'crm_leads'
    });
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewOpen(true);
  };

  const shareViaWhatsApp = (lead: Lead) => {
    const message = `Lead: ${lead.name}\nCompany: ${lead.company}\nValue: ${lead.value}\nStage: ${lead.stage}\nContact: ${lead.phone}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showSuccess('Opening WhatsApp...');
  };

  const shareViaEmail = (lead: Lead) => {
    const subject = `Lead Information - ${lead.name}`;
    const body = `Lead Details:\n\nName: ${lead.name}\nCompany: ${lead.company}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nValue: ${lead.value}\nStage: ${lead.stage}\nSource: ${lead.source}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    showSuccess('Opening email client...');
  };

  const copyLeadLink = (lead: Lead) => {
    const link = `https://erp.example.com/crm/${lead.id}`;
    navigator.clipboard.writeText(link);
    showSuccess('Lead link copied to clipboard!');
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
                <Target className="h-5 w-5" />
                Sales Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesFunnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="stage" type="category" className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} name="Leads">
                      {salesFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Lead Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
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
                <TrendingUp className="h-5 w-5" />
                Conversion Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyConversionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} name="Leads" />
                    <Line type="monotone" dataKey="converted" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Converted" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Recent Leads</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={stageFilter}
                    onChange={(e) => handleStageChange(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Stages</option>
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won</option>
                  </select>
                  <select
                    value={sourceFilter}
                    onChange={(e) => handleSourceChange(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Sources</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Trade Show">Trade Show</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span className="hidden sm:inline">Excel</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
                    <FileDown className="h-4 w-4 text-red-600" />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Lead ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Stage</TableHead>
                    <TableHead className="font-semibold">Source</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLeads.length > 0 ? (
                    paginatedLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-primary">{lead.id}</TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">{lead.email}</span>
                          <span className="text-xs text-muted-foreground">{lead.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{lead.value}</TableCell>
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
