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
import { Plus, Package, Warehouse, AlertTriangle, TrendingUp, Eye, Edit, Trash2, FileSpreadsheet, FileDown, ArrowUpRight, ArrowDownRight, Search, DollarSign, ShoppingCart, BarChart3, Printer, Share2, MessageSquare, Mail, Link2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { exportToPDF, exportToExcel, exportSingleRecordPDF } from "@/lib/pdfExport";

const stats = [
  { title: "Total Items", value: "1,234", change: "+45", trend: "up", icon: Package, color: "text-success", bgColor: "bg-blue-500/10" },
  { title: "Warehouses", value: "5", change: "+1", trend: "up", icon: Warehouse, color: "text-primary", bgColor: "bg-purple-500/10" },
  { title: "Low Stock", value: "23", change: "-5", trend: "down", icon: AlertTriangle, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Stock Value", value: "Rs 8,923,400", change: "+12.8%", trend: "up", icon: DollarSign, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Out of Stock", value: "8", change: "-2", trend: "down", icon: Package, color: "text-destructive", bgColor: "bg-red-500/10" },
  { title: "Avg Item Value", value: "Rs 7,232", change: "+8.2%", trend: "up", icon: TrendingUp, color: "text-success", bgColor: "bg-pink-500/10" },
];

const stockMovementData = [
  { month: "Jan", inbound: 450, outbound: 380 },
  { month: "Feb", inbound: 520, outbound: 420 },
  { month: "Mar", inbound: 480, outbound: 390 },
  { month: "Apr", inbound: 610, outbound: 480 },
  { month: "May", inbound: 550, outbound: 440 },
  { month: "Jun", inbound: 670, outbound: 520 },
];

const warehouseDistribution = [
  { name: "Main Warehouse", value: 450, color: "hsl(var(--primary))" },
  { name: "Warehouse A", value: 320, color: "hsl(142, 76%, 36%)" },
  { name: "Warehouse B", value: 280, color: "hsl(48, 96%, 53%)" },
  { name: "Warehouse C", value: 184, color: "hsl(221, 83%, 53%)" },
];

const categoryStockData = [
  { category: "Electronics", stock: 450, value: 3850000 },
  { category: "Furniture", stock: 320, value: 2200000 },
  { category: "Accessories", stock: 280, value: 1500000 },
  { category: "Office Supplies", stock: 184, value: 1373400 },
];

const initialInventoryItems = [
  { id: "ITM-001", name: "Laptop Pro 15", sku: "LP-15-001", quantity: 45, reorderLevel: 10, costPrice: 72000, unitPrice: 85000, warehouse: "Main", status: "in-stock" },
  { id: "ITM-002", name: "Wireless Mouse", sku: "WM-002", quantity: 8, reorderLevel: 15, costPrice: 2000, unitPrice: 2500, warehouse: "Main", status: "low-stock" },
  { id: "ITM-003", name: "USB-C Cable", sku: "UC-003", quantity: 150, reorderLevel: 50, costPrice: 600, unitPrice: 800, warehouse: "Warehouse A", status: "in-stock" },
  { id: "ITM-004", name: "Monitor 27\"", sku: "MN-27-004", quantity: 0, reorderLevel: 5, costPrice: 38000, unitPrice: 45000, warehouse: "Main", status: "out-of-stock" },
  { id: "ITM-005", name: "Keyboard Mechanical", sku: "KB-MEC-005", quantity: 32, reorderLevel: 10, costPrice: 9500, unitPrice: 12000, warehouse: "Warehouse B", status: "in-stock" },
  { id: "ITM-006", name: "Webcam HD", sku: "WC-HD-006", quantity: 25, reorderLevel: 10, costPrice: 7000, unitPrice: 8500, warehouse: "Warehouse A", status: "in-stock" },
  { id: "ITM-007", name: "Headphones Wireless", sku: "HP-WL-007", quantity: 40, reorderLevel: 15, costPrice: 5200, unitPrice: 6500, warehouse: "Main", status: "in-stock" },
  { id: "ITM-008", name: "External SSD 1TB", sku: "SSD-1TB-008", quantity: 15, reorderLevel: 8, costPrice: 15000, unitPrice: 18000, warehouse: "Warehouse B", status: "in-stock" },
  { id: "ITM-009", name: "Docking Station", sku: "DS-009", quantity: 0, reorderLevel: 5, costPrice: 12500, unitPrice: 15000, warehouse: "Main", status: "out-of-stock" },
  { id: "ITM-010", name: "Ergonomic Chair", sku: "EC-010", quantity: 18, reorderLevel: 5, costPrice: 28000, unitPrice: 35000, warehouse: "Warehouse C", status: "in-stock" },
  { id: "ITM-011", name: "Standing Desk", sku: "SD-011", quantity: 7, reorderLevel: 3, costPrice: 45000, unitPrice: 55000, warehouse: "Warehouse C", status: "low-stock" },
  { id: "ITM-012", name: "Printer Laser", sku: "PL-012", quantity: 12, reorderLevel: 4, costPrice: 35000, unitPrice: 42000, warehouse: "Main", status: "in-stock" },
];

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  costPrice: number;
  unitPrice: number;
  warehouse: string;
  status: string;
}

export default function Inventory() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [items, setItems] = useState(initialInventoryItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesWarehouse = warehouseFilter === "all" || item.warehouse === warehouseFilter;
    return matchesSearch && matchesStatus && matchesWarehouse;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleWarehouseChange = (value: string) => {
    setWarehouseFilter(value);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    if (!name || !sku || !warehouse) {
      showError("Please fill all required fields");
      return;
    }

    const qty = parseInt(quantity) || 0;
    const status = qty === 0 ? "out-of-stock" : qty < 10 ? "low-stock" : "in-stock";

    if (editingId) {
      setItems(items.map(item => 
        item.id === editingId 
          ? { ...item, name, sku, quantity: qty, warehouse, status }
          : item
      ));
      showSuccess("Item updated successfully!");
    } else {
      const newItem = {
        id: `ITM-${Date.now().toString().slice(-6)}`,
        name,
        sku,
        quantity: qty,
        reorderLevel: 10,
        costPrice: 0,
        unitPrice: 0,
        warehouse,
        status
      };
      setItems([newItem, ...items]);
      showSuccess("Item added successfully!");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setSku(item.sku);
    setQuantity(item.quantity.toString());
    setWarehouse(item.warehouse);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(item => item.id !== id));
      showSuccess("Item deleted successfully!");
    }
  };

  const resetForm = () => {
    setName("");
    setSku("");
    setQuantity("");
    setWarehouse("");
    setEditingId(null);
  };

  const handleExportPDF = () => {
    const result = exportToPDF({
      title: 'Inventory Report',
      columns: [
        { header: 'Item ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'SKU', key: 'sku' },
        { header: 'Quantity', key: 'quantity' },
        { header: 'Warehouse', key: 'warehouse' },
        { header: 'Status', key: 'status', format: (val) => val.toUpperCase().replace('-', ' ') }
      ],
      data: items,
      filename: 'inventory'
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
        { header: 'Item ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'SKU', key: 'sku' },
        { header: 'Quantity', key: 'quantity' },
        { header: 'Warehouse', key: 'warehouse' },
        { header: 'Status', key: 'status' }
      ],
      data: items,
      filename: 'inventory'
    });
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
  };

  const handleExportSingleItem = (item: InventoryItem) => {
    const result = exportSingleRecordPDF({
      title: 'INVENTORY ITEM',
      recordId: item.id,
      fields: [
        { label: 'Item Name', value: item.name },
        { label: 'SKU', value: item.sku },
        { label: 'Warehouse', value: item.warehouse },
        { label: 'Status', value: item.status.toUpperCase().replace('-', ' ') },
        { label: 'Quantity', value: item.quantity.toString(), highlight: true }
      ]
    });
    if (!result.success) {
      showError(result.message);
    }
  };

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const shareViaWhatsApp = (item: InventoryItem) => {
    const message = `Item: ${item.name}\nSKU: ${item.sku}\nQuantity: ${item.quantity}\nPrice: Rs ${item.unitPrice.toLocaleString('en-PK')}\nWarehouse: ${item.warehouse}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showSuccess('Opening WhatsApp...');
  };

  const shareViaEmail = (item: InventoryItem) => {
    const subject = `Inventory Item - ${item.name}`;
    const body = `Item Details:\n\nName: ${item.name}\nSKU: ${item.sku}\nQuantity: ${item.quantity}\nCost Price: Rs ${item.costPrice.toLocaleString('en-PK')}\nSelling Price: Rs ${item.unitPrice.toLocaleString('en-PK')}\nWarehouse: ${item.warehouse}\nStatus: ${item.status}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    showSuccess('Opening email client...');
  };

  const copyItemLink = (item: InventoryItem) => {
    const link = `https://erp.example.com/inventory/${item.id}`;
    navigator.clipboard.writeText(link);
    showSuccess('Item link copied to clipboard!');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      "in-stock": { variant: "default", label: "In Stock" },
      "low-stock": { variant: "secondary", label: "Low Stock" },
      "out-of-stock": { variant: "destructive", label: "Out of Stock" },
    };
    const config = variants[status] || variants["in-stock"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track stock levels, warehouses, and inventory movements
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Item" : "Add New Item"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name *</Label>
                    <Input id="item-name" placeholder="Enter item name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input id="sku" placeholder="Enter SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input id="quantity" type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="warehouse">Warehouse *</Label>
                    <select
                      id="warehouse"
                      value={warehouse}
                      onChange={(e) => setWarehouse(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select warehouse</option>
                      <option value="Main">Main</option>
                      <option value="Warehouse A">Warehouse A</option>
                      <option value="Warehouse B">Warehouse B</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit-price">Unit Price</Label>
                    <Input id="unit-price" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Item description..." />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <Button className="bg-gradient-primary" onClick={handleCreate}>
                    {editingId ? "Update Item" : "Add Item"}
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
                <BarChart3 className="h-5 w-5" />
                Stock Movement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockMovementData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="inbound" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Inbound" />
                    <Line type="monotone" dataKey="outbound" stroke="hsl(0, 84%, 60%)" strokeWidth={2} name="Outbound" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Warehouse Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={warehouseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {warehouseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Stock Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Stock by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStockData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="category" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Stock Quantity" />
                  <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[8, 8, 0, 0]} name="Stock Value (Rs)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} items
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
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
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                  <select
                    value={warehouseFilter}
                    onChange={(e) => handleWarehouseChange(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Warehouses</option>
                    <option value="Main">Main</option>
                    <option value="Warehouse A">Warehouse A</option>
                    <option value="Warehouse B">Warehouse B</option>
                    <option value="Warehouse C">Warehouse C</option>
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
                    <TableHead className="font-semibold">Item ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Cost Price</TableHead>
                    <TableHead className="font-semibold">Selling Price</TableHead>
                    <TableHead className="font-semibold">Profit</TableHead>
                    <TableHead className="font-semibold">Total Value</TableHead>
                    <TableHead className="font-semibold">Warehouse</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-primary">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">Rs {item.costPrice.toLocaleString('en-PK')}</TableCell>
                      <TableCell className="font-semibold">Rs {item.unitPrice.toLocaleString('en-PK')}</TableCell>
                      <TableCell className="font-semibold text-success">
                        Rs {(item.unitPrice - item.costPrice).toLocaleString('en-PK')}
                        <span className="text-xs ml-1">({(((item.unitPrice - item.costPrice) / item.costPrice) * 100).toFixed(1)}%)</span>
                      </TableCell>
                      <TableCell className="font-bold text-primary">Rs {(item.quantity * item.unitPrice).toLocaleString('en-PK')}</TableCell>
                      <TableCell className="text-muted-foreground">{item.warehouse}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View" onClick={() => handleViewItem(item)} className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Export PDF" onClick={() => handleExportSingleItem(item)} className="hover:bg-purple-500/10">
                            <FileDown className="h-4 w-4 text-purple-600" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(item)} className="hover:bg-blue-500/10">
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(item.id)} className="hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No items found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-primary">{item.id}</p>
                      <p className="text-base font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Quantity</p>
                      <p className="font-semibold">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Warehouse</p>
                      <p className="font-semibold">{item.warehouse}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Cost Price</p>
                      <p className="font-semibold">Rs {item.costPrice.toLocaleString('en-PK')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Selling Price</p>
                      <p className="font-semibold">Rs {item.unitPrice.toLocaleString('en-PK')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Profit/Unit</p>
                      <p className="font-semibold text-success">Rs {(item.unitPrice - item.costPrice).toLocaleString('en-PK')} ({(((item.unitPrice - item.costPrice) / item.costPrice) * 100).toFixed(1)}%)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Total Value</p>
                      <p className="font-bold text-primary">Rs {(item.quantity * item.unitPrice).toLocaleString('en-PK')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewItem(item)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportSingleItem(item)}>
                      <FileDown className="h-4 w-4 text-purple-600" />
                      PDF
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No items found. Try adjusting your search or filters.
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredItems.length > itemsPerPage && (
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

        {/* Advanced Item View Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">Item Details</DialogTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => selectedItem && handleExportSingleItem(selectedItem)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => selectedItem && handleExportSingleItem(selectedItem)}>
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6 py-4">
                {/* Professional Item Preview */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-lg">
                  {/* Item Header */}
                  <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-primary">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-primary">ErpMax</h2>
                          <p className="text-sm text-gray-600">Inventory Management</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-4xl font-bold text-gray-800 mb-2">ITEM DETAILS</h3>
                      <div className="bg-primary/10 px-4 py-2 rounded-lg inline-block">
                        <p className="text-2xl font-bold text-primary">{selectedItem.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Item Information Grid */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Item Information:</p>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="text-xl font-bold text-gray-800">{selectedItem.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">SKU</p>
                          <p className="text-lg font-semibold">{selectedItem.sku}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Warehouse:</span>
                          <span className="text-sm font-bold">{selectedItem.warehouse}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Reorder Level:</span>
                          <span className="text-sm font-bold">{selectedItem.reorderLevel}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Status:</span>
                          {getStatusBadge(selectedItem.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock & Pricing Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Stock Information</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-800">Current Stock:</span>
                          <span className="text-2xl font-bold text-blue-900">{selectedItem.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-800">Reorder Point:</span>
                          <span className="text-lg font-semibold text-blue-900">{selectedItem.reorderLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                      <p className="text-sm font-semibold text-green-900 mb-2">Pricing Information</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-green-800">Cost Price:</span>
                          <span className="text-lg font-semibold text-green-900">Rs {selectedItem.costPrice.toLocaleString('en-PK')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-800">Selling Price:</span>
                          <span className="text-lg font-semibold text-green-900">Rs {selectedItem.unitPrice.toLocaleString('en-PK')}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-200 pt-2">
                          <span className="text-sm text-green-800">Profit/Unit:</span>
                          <span className="text-lg font-bold text-green-600">
                            Rs {(selectedItem.unitPrice - selectedItem.costPrice).toLocaleString('en-PK')}
                            <span className="text-xs ml-1">({(((selectedItem.unitPrice - selectedItem.costPrice) / selectedItem.costPrice) * 100).toFixed(1)}%)</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border-2 border-primary/20 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700">Total Stock Value:</span>
                      <span className="text-3xl font-bold text-primary">Rs {(selectedItem.quantity * selectedItem.unitPrice).toLocaleString('en-PK')}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">ErpMax Pakistan - Inventory Management System</p>
                    <p className="text-xs text-gray-500 mt-1">Generated on: {new Date().toLocaleDateString('en-PK')}</p>
                  </div>
                </div>

                {/* Share Options */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Share Item Details
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-green-50 border-green-200"
                      onClick={() => shareViaWhatsApp(selectedItem)}
                    >
                      <MessageSquare className="h-6 w-6 text-green-600 mb-2" />
                      <span className="text-sm font-semibold">WhatsApp</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-blue-50 border-blue-200"
                      onClick={() => shareViaEmail(selectedItem)}
                    >
                      <Mail className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="text-sm font-semibold">Email</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-gray-50 border-gray-200"
                      onClick={() => copyItemLink(selectedItem)}
                    >
                      <Link2 className="h-6 w-6 text-gray-600 mb-2" />
                      <span className="text-sm font-semibold">Copy Link</span>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {selectedItem.quantity <= selectedItem.reorderLevel && (
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90" size="lg">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Reorder Stock
                    </Button>
                  )}
                  <Button variant="outline" size="lg" onClick={() => {
                    handleEdit(selectedItem);
                    setViewOpen(false);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Item
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
