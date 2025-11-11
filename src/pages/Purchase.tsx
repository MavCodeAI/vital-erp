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
import { Plus, ShoppingBag, FileText, Clock, CheckCircle2, Eye, Edit, Trash2, FileSpreadsheet, FileDown, Share2, Mail, MessageSquare, Link2, Printer, Send, Package, TrendingUp, ArrowUpRight, ArrowDownRight, Search, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { exportToPDF, exportToExcel, exportSingleRecordPDF } from "@/lib/pdfExport";

const stats = [
  { title: "Total Purchase", value: "Rs 8,923,400", change: "+15.2%", trend: "up", icon: ShoppingBag, color: "text-success", bgColor: "bg-blue-500/10" },
  { title: "Purchase Orders", value: "89", change: "+12", trend: "up", icon: FileText, color: "text-primary", bgColor: "bg-purple-500/10" },
  { title: "Pending", value: "12", change: "-3", trend: "down", icon: Clock, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Received", value: "77", change: "+15", trend: "up", icon: CheckCircle2, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Active Vendors", value: "34", change: "+5", trend: "up", icon: Package, color: "text-primary", bgColor: "bg-orange-500/10" },
  { title: "Avg PO Value", value: "Rs 100,268", change: "+8.5%", trend: "up", icon: DollarSign, color: "text-success", bgColor: "bg-pink-500/10" },
];

const monthlyPurchaseData = [
  { month: "Jan", purchase: 650000, orders: 18 },
  { month: "Feb", purchase: 720000, orders: 22 },
  { month: "Mar", purchase: 580000, orders: 16 },
  { month: "Apr", purchase: 890000, orders: 28 },
  { month: "May", purchase: 760000, orders: 24 },
  { month: "Jun", purchase: 950000, orders: 32 },
];

const vendorDistribution = [
  { name: "Karachi Suppliers", value: 2800000, color: "hsl(var(--primary))" },
  { name: "Lahore Wholesale", value: 2100000, color: "hsl(142, 76%, 36%)" },
  { name: "Pakistan Trade", value: 1800000, color: "hsl(48, 96%, 53%)" },
  { name: "Others", value: 2223400, color: "hsl(221, 83%, 53%)" },
];

const categoryData = [
  { category: "Raw Materials", amount: 3500000 },
  { category: "Equipment", amount: 2200000 },
  { category: "Supplies", amount: 1800000 },
  { category: "Services", amount: 1423400 },
];

const initialPurchaseOrders = [
  { id: "PO-001", vendor: "Karachi Suppliers", amount: "Rs 1,250,000", date: "2024-01-15", deliveryDate: "2024-01-25", status: "received", items: 8 },
  { id: "PO-002", vendor: "Lahore Wholesale", amount: "Rs 820,000", date: "2024-01-14", deliveryDate: "2024-01-24", status: "pending", items: 5 },
  { id: "PO-003", vendor: "Pakistan Trade", amount: "Rs 1,580,000", date: "2024-01-13", deliveryDate: "2024-01-23", status: "received", items: 12 },
  { id: "PO-004", vendor: "Multan Vendors", amount: "Rs 690,000", date: "2024-01-12", deliveryDate: "2024-01-22", status: "pending", items: 4 },
  { id: "PO-005", vendor: "Peshawar Supplies", amount: "Rs 910,000", date: "2024-01-11", deliveryDate: "2024-01-21", status: "received", items: 6 },
  { id: "PO-006", vendor: "Islamabad Traders", amount: "Rs 1,120,000", date: "2024-01-10", deliveryDate: "2024-01-20", status: "received", items: 9 },
  { id: "PO-007", vendor: "Faisalabad Corp", amount: "Rs 540,000", date: "2024-01-09", deliveryDate: "2024-01-19", status: "pending", items: 3 },
  { id: "PO-008", vendor: "Rawalpindi Supplies", amount: "Rs 780,000", date: "2024-01-08", deliveryDate: "2024-01-18", status: "received", items: 7 },
  { id: "PO-009", vendor: "Sialkot Industries", amount: "Rs 1,450,000", date: "2024-01-07", deliveryDate: "2024-01-17", status: "received", items: 11 },
  { id: "PO-010", vendor: "Gujranwala Vendors", amount: "Rs 620,000", date: "2024-01-06", deliveryDate: "2024-01-16", status: "pending", items: 4 },
];

interface PurchaseOrder {
  id: string;
  vendor: string;
  amount: string;
  date: string;
  deliveryDate: string;
  status: string;
  items: number;
}

export default function Purchase() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [orders, setOrders] = useState(initialPurchaseOrders);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vendor, setVendor] = useState("");
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    if (!vendor) {
      showError("Please select a vendor");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      showError("Please enter a valid amount");
      return;
    }

    if (editingId) {
      setOrders(orders.map(po => 
        po.id === editingId 
          ? { ...po, vendor, amount: `Rs ${parseFloat(amount).toLocaleString('en-PK')}`, date: poDate }
          : po
      ));
      showSuccess("Purchase order updated successfully!");
    } else {
      const newPO = {
        id: `PO-${Date.now().toString().slice(-6)}`,
        vendor,
        amount: `Rs ${parseFloat(amount).toLocaleString('en-PK')}`,
        date: poDate,
        deliveryDate: new Date(new Date(poDate).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "pending",
        items: 1
      };
      setOrders([newPO, ...orders]);
      showSuccess("Purchase order created successfully!");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (po: PurchaseOrder) => {
    setEditingId(po.id);
    setVendor(po.vendor);
    setPoDate(po.date);
    setAmount(po.amount.replace(/[^0-9.-]+/g, ""));
    setOpen(true);
  };

  const handleReceive = (id: string) => {
    setOrders(orders.map(po => 
      po.id === id ? { ...po, status: "received" } : po
    ));
    showSuccess("Purchase order marked as received!");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this purchase order?")) {
      setOrders(orders.filter(po => po.id !== id));
      showSuccess("Purchase order deleted successfully!");
    }
  };

  const resetForm = () => {
    setVendor("");
    setPoDate(new Date().toISOString().split('T')[0]);
    setAmount("");
    setEditingId(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      received: { variant: "default", label: "Received" },
      pending: { variant: "secondary", label: "Pending" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleExportPDF = () => {
    const result = exportToPDF({
      title: 'Purchase Orders Report',
      columns: [
        { header: 'PO ID', key: 'id' },
        { header: 'Vendor', key: 'vendor' },
        { header: 'Amount', key: 'amount' },
        { header: 'Date', key: 'date' },
        { header: 'Status', key: 'status', format: (val) => val.toUpperCase() }
      ],
      data: orders,
      filename: 'purchase_orders'
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
        { header: 'PO ID', key: 'id' },
        { header: 'Vendor', key: 'vendor' },
        { header: 'Amount', key: 'amount' },
        { header: 'Date', key: 'date' },
        { header: 'Status', key: 'status' }
      ],
      data: orders,
      filename: 'purchase_orders'
    });
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
  };

  const handleExportSinglePO = (po: PurchaseOrder) => {
    const result = exportSingleRecordPDF({
      title: 'PURCHASE ORDER',
      recordId: po.id,
      fields: [
        { label: 'Vendor', value: po.vendor },
        { label: 'PO Date', value: po.date },
        { label: 'Status', value: po.status.toUpperCase() },
        { label: 'Total Amount', value: po.amount, highlight: true }
      ]
    });
    if (!result.success) {
      showError(result.message);
    }
  };

  const handleViewPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setViewOpen(true);
  };

  const shareViaWhatsApp = (po: PurchaseOrder) => {
    const message = `Purchase Order ${po.id}\nVendor: ${po.vendor}\nAmount: ${po.amount}\nDate: ${po.date}\n\nView PO: https://erp.example.com/po/${po.id}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showSuccess('Opening WhatsApp...');
  };

  const shareViaEmail = (po: PurchaseOrder) => {
    const subject = `Purchase Order ${po.id} - ${po.vendor}`;
    const body = `Dear ${po.vendor},\n\nPlease find purchase order details below:\n\nPO Number: ${po.id}\nAmount: ${po.amount}\nDate: ${po.date}\n\nThank you!\n\nBest regards,\nErpMax Pakistan`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    showSuccess('Opening email client...');
  };

  const shareViaSMS = (po: PurchaseOrder) => {
    const message = `PO ${po.id} for ${po.amount}. Date: ${po.date}. View: https://erp.example.com/po/${po.id}`;
    const url = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = url;
    showSuccess('Opening SMS...');
  };

  const copyPOLink = (po: PurchaseOrder) => {
    const link = `https://erp.example.com/po/${po.id}`;
    navigator.clipboard.writeText(link);
    showSuccess('PO link copied to clipboard!');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Purchase</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage purchase orders and vendor relationships
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                New PO
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Purchase Order" : "Create New Purchase Order"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor *</Label>
                    <select
                      id="vendor"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select vendor</option>
                      <option value="Karachi Suppliers">Karachi Suppliers</option>
                      <option value="Lahore Wholesale">Lahore Wholesale</option>
                      <option value="Islamabad Suppliers">Islamabad Suppliers</option>
                      <option value="Multan Vendors">Multan Vendors</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="po-date">PO Date *</Label>
                    <Input id="po-date" type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-date">Expected Delivery</Label>
                    <Input id="delivery-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="po-status">Status</Label>
                    <Select>
                      <SelectTrigger id="po-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="po-items">Items</Label>
                  <Input id="po-items" placeholder="Add purchase items..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount (Rs) *</Label>
                  <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="po-notes">Notes</Label>
                  <Input id="po-notes" placeholder="Additional notes..." />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <Button className="bg-gradient-primary" onClick={handleCreate}>
                    {editingId ? "Update PO" : "Create PO"}
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
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Purchase Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyPurchaseData}>
                    <defs>
                      <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="purchase" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPurchase)" strokeWidth={2} name="Purchase (Rs)" />
                    <Line type="monotone" dataKey="orders" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Orders" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vendorDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vendorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Rs ${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Purchase by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Amount (Rs)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Recent Purchase Orders</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="received">Received</option>
                    <option value="pending">Pending</option>
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
                    <TableHead className="font-semibold">PO ID</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">PO Date</TableHead>
                    <TableHead className="font-semibold">Delivery Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((po) => (
                    <TableRow key={po.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-primary">{po.id}</TableCell>
                      <TableCell className="font-medium">{po.vendor}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {po.items} items
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{po.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{po.date}</TableCell>
                      <TableCell className="text-muted-foreground">{po.deliveryDate}</TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View" onClick={() => handleViewPO(po)} className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Export PDF" onClick={() => handleExportSinglePO(po)} className="hover:bg-purple-500/10">
                            <FileDown className="h-4 w-4 text-purple-600" />
                          </Button>
                          {po.status === "pending" && (
                            <Button variant="ghost" size="icon" title="Mark as Received" onClick={() => handleReceive(po.id)} className="hover:bg-green-500/10">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(po)} className="hover:bg-blue-500/10">
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(po.id)} className="hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No purchase orders found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((po) => (
                <div key={po.id} className="border rounded-lg p-4 space-y-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-primary">{po.id}</p>
                      <p className="text-sm text-muted-foreground">{po.vendor}</p>
                      <span className="inline-flex items-center mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {po.items} items
                      </span>
                    </div>
                    {getStatusBadge(po.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">PO Date:</span>
                      <p className="font-medium">{po.date}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Delivery:</span>
                      <p className="font-medium">{po.deliveryDate}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Amount</span>
                    <span className="font-bold text-lg">{po.amount}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewPO(po)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportSinglePO(po)}>
                      <FileDown className="h-4 w-4 text-purple-600" />
                    </Button>
                    {po.status === "pending" && (
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReceive(po.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Receive
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(po)}>
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(po.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No purchase orders found. Try adjusting your search or filters.
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredOrders.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-9"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
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

        {/* Advanced PO View Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">Purchase Order Preview</DialogTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => selectedPO && handleExportSinglePO(selectedPO)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => selectedPO && handleExportSinglePO(selectedPO)}>
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </DialogHeader>
            {selectedPO && (
              <div className="space-y-6 py-4">
                {/* Professional PO Preview */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-lg">
                  {/* Company Header */}
                  <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-primary">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-primary">ErpMax</h2>
                          <p className="text-sm text-gray-600">Pakistan</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        <p>123 Business Street</p>
                        <p>Karachi, Pakistan</p>
                        <p>Phone: +92 300 1234567</p>
                        <p>Email: info@erpmax.pk</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-4xl font-bold text-gray-800 mb-2">PURCHASE ORDER</h3>
                      <div className="bg-primary/10 px-4 py-2 rounded-lg inline-block">
                        <p className="text-2xl font-bold text-primary">{selectedPO.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* PO Details Grid */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Vendor:</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xl font-bold text-gray-800">{selectedPO.vendor}</p>
                        <p className="text-sm text-gray-600 mt-1">Vendor Address</p>
                        <p className="text-sm text-gray-600">City, Country</p>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">PO Date:</span>
                          <span className="text-sm font-bold">{selectedPO.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Expected Delivery:</span>
                          <span className="text-sm font-bold">7-10 days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Status:</span>
                          {getStatusBadge(selectedPO.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-y-2 border-gray-300">
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">#</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Item Description</th>
                          <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Qty</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Unit Price</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((i) => (
                          <tr key={i} className="border-b border-gray-200">
                            <td className="py-3 px-4 text-sm">{i}</td>
                            <td className="py-3 px-4 text-sm">Product Item {i}</td>
                            <td className="py-3 px-4 text-sm text-center">10</td>
                            <td className="py-3 px-4 text-sm text-right">Rs {(parseFloat(selectedPO.amount.replace(/[^0-9.-]+/g, '')) / 30).toLocaleString('en-PK', { minimumFractionDigits: 2 })}</td>
                            <td className="py-3 px-4 text-sm text-right font-semibold">Rs {(parseFloat(selectedPO.amount.replace(/[^0-9.-]+/g, '')) / 3).toLocaleString('en-PK', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-80">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">{selectedPO.amount}</span>
                        </div>
                        <div className="border-t-2 border-gray-300 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                            <span className="text-2xl font-bold text-primary">{selectedPO.amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
                    <p className="text-sm font-semibold text-yellow-900 mb-1">Terms & Conditions</p>
                    <p className="text-xs text-yellow-800">Payment: Net 30 days | Delivery: FOB Destination | Quality inspection required</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">Thank you for your service!</p>
                    <p className="text-xs text-gray-500 mt-1">This is a computer-generated purchase order.</p>
                  </div>
                </div>

                {/* Share Options */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Share Purchase Order
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-green-50 border-green-200"
                      onClick={() => shareViaWhatsApp(selectedPO)}
                    >
                      <MessageSquare className="h-6 w-6 text-green-600 mb-2" />
                      <span className="text-sm font-semibold">WhatsApp</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-blue-50 border-blue-200"
                      onClick={() => shareViaEmail(selectedPO)}
                    >
                      <Mail className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="text-sm font-semibold">Email</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-purple-50 border-purple-200"
                      onClick={() => shareViaSMS(selectedPO)}
                    >
                      <Send className="h-6 w-6 text-purple-600 mb-2" />
                      <span className="text-sm font-semibold">SMS</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-gray-50 border-gray-200"
                      onClick={() => copyPOLink(selectedPO)}
                    >
                      <Link2 className="h-6 w-6 text-gray-600 mb-2" />
                      <span className="text-sm font-semibold">Copy Link</span>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {selectedPO.status === "pending" && (
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90" size="lg" onClick={() => {
                      handleReceive(selectedPO.id);
                      setViewOpen(false);
                    }}>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Mark as Received
                    </Button>
                  )}
                  {selectedPO.status === "received" && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" size="lg" disabled>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Received
                    </Button>
                  )}
                  <Button variant="outline" size="lg" onClick={() => {
                    handleEdit(selectedPO);
                    setViewOpen(false);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit PO
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
