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
import { Plus, Package, Warehouse, AlertTriangle, TrendingUp, Eye, Edit, Trash2 } from "lucide-react";

const stats = [
  { title: "Total Items", value: "1,234", icon: Package, color: "text-primary" },
  { title: "Warehouses", value: "5", icon: Warehouse, color: "text-primary" },
  { title: "Low Stock", value: "23", icon: AlertTriangle, color: "text-warning" },
  { title: "Stock Value", value: "Rs 8,923,400", icon: TrendingUp, color: "text-success" },
];

const initialInventoryItems = [
  { id: "ITM-001", name: "Laptop Pro 15", sku: "LP-15-001", quantity: 45, warehouse: "Main", status: "in-stock" },
  { id: "ITM-002", name: "Wireless Mouse", sku: "WM-002", quantity: 8, warehouse: "Main", status: "low-stock" },
  { id: "ITM-003", name: "USB-C Cable", sku: "UC-003", quantity: 150, warehouse: "Warehouse A", status: "in-stock" },
  { id: "ITM-004", name: "Monitor 27\"", sku: "MN-27-004", quantity: 0, warehouse: "Main", status: "out-of-stock" },
  { id: "ITM-005", name: "Keyboard Mechanical", sku: "KB-MEC-005", quantity: 32, warehouse: "Warehouse B", status: "in-stock" },
];

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  warehouse: string;
  status: string;
}

export default function Inventory() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialInventoryItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warehouse, setWarehouse] = useState("");

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

        {/* Inventory Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.warehouse}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(item.id)}>
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
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{item.id}</p>
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
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
