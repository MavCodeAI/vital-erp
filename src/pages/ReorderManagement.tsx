import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showSuccess, showError } from "@/lib/toast";
import { 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  ShoppingCart, 
  Mail, 
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Edit,
  Send
} from "lucide-react";

const stats = [
  { title: "Low Stock Items", value: "12", change: "+3", trend: "up", icon: AlertTriangle, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Out of Stock", value: "5", change: "+2", trend: "up", icon: Package, color: "text-destructive", bgColor: "bg-red-500/10" },
  { title: "Auto POs Generated", value: "8", change: "+5", trend: "up", icon: ShoppingCart, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Alerts Sent", value: "15", change: "+7", trend: "up", icon: Mail, color: "text-primary", bgColor: "bg-blue-500/10" },
];

const initialItems = [
  {
    id: "1",
    sku: "LAP-001",
    name: "Laptop Pro 15",
    currentStock: 5,
    reorderPoint: 10,
    reorderQuantity: 20,
    supplier: "Tech Suppliers Ltd",
    supplierEmail: "orders@techsuppliers.pk",
    leadTime: "7 days",
    status: "low",
    lastOrdered: "2024-01-10",
    autoReorder: true
  },
  {
    id: "2",
    sku: "MON-002",
    name: "Monitor 27 inch",
    currentStock: 2,
    reorderPoint: 8,
    reorderQuantity: 15,
    supplier: "Display Solutions",
    supplierEmail: "sales@displaysolutions.pk",
    leadTime: "5 days",
    status: "critical",
    lastOrdered: "2024-01-08",
    autoReorder: true
  },
  {
    id: "3",
    sku: "KEY-003",
    name: "Wireless Keyboard",
    currentStock: 0,
    reorderPoint: 15,
    reorderQuantity: 30,
    supplier: "Peripherals Inc",
    supplierEmail: "orders@peripherals.pk",
    leadTime: "3 days",
    status: "out",
    lastOrdered: "2024-01-05",
    autoReorder: true
  },
  {
    id: "4",
    sku: "MOU-004",
    name: "Gaming Mouse",
    currentStock: 8,
    reorderPoint: 12,
    reorderQuantity: 25,
    supplier: "Gaming Gear Co",
    supplierEmail: "support@gaminggear.pk",
    leadTime: "4 days",
    status: "low",
    lastOrdered: "2024-01-12",
    autoReorder: false
  },
  {
    id: "5",
    sku: "HDD-005",
    name: "External HDD 2TB",
    currentStock: 3,
    reorderPoint: 10,
    reorderQuantity: 20,
    supplier: "Storage Solutions",
    supplierEmail: "orders@storage.pk",
    leadTime: "6 days",
    status: "critical",
    lastOrdered: "2024-01-09",
    autoReorder: true
  },
];

export default function ReorderManagement() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState<typeof initialItems[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      out: { variant: "destructive" as const, label: "Out of Stock" },
      critical: { variant: "destructive" as const, label: "Critical" },
      low: { variant: "secondary" as const, label: "Low Stock" },
      ok: { variant: "default" as const, label: "OK" }
    };
    const config = variants[status as keyof typeof variants] || variants.ok;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleGeneratePO = (item: typeof initialItems[0]) => {
    showSuccess(`Purchase Order generated for ${item.name} (${item.reorderQuantity} units)`);
  };

  const handleNotifySupplier = (item: typeof initialItems[0]) => {
    showSuccess(`Email sent to ${item.supplier} at ${item.supplierEmail}`);
  };

  const handleToggleAutoReorder = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, autoReorder: !item.autoReorder } : item
    ));
    showSuccess("Auto-reorder setting updated!");
  };

  const handleUpdateReorderPoint = () => {
    if (!selectedItem) return;
    showSuccess(`Reorder point updated for ${selectedItem.name}`);
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reorder Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Automatic inventory reorder points and alerts
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Reorder Rule
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
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
                  <span className="text-muted-foreground">today</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert Banner */}
        <Card className="border-warning bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Urgent: 5 Items Out of Stock</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  These items need immediate attention. Auto-reorder is enabled for 3 items.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="default">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Generate All POs
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Notify All Suppliers
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reorder Items Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Inventory Reorder Points</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold">Current Stock</TableHead>
                    <TableHead className="font-semibold">Reorder Point</TableHead>
                    <TableHead className="font-semibold">Reorder Qty</TableHead>
                    <TableHead className="font-semibold">Supplier</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Auto-Reorder</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-primary">{item.sku}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          item.currentStock === 0 ? 'text-destructive' :
                          item.currentStock < item.reorderPoint ? 'text-warning' :
                          'text-success'
                        }`}>
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell>{item.reorderPoint}</TableCell>
                      <TableCell>{item.reorderQuantity}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{item.supplier}</p>
                          <p className="text-xs text-muted-foreground">{item.leadTime}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant={item.autoReorder ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleAutoReorder(item.id)}
                        >
                          {item.autoReorder ? "ON" : "OFF"}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGeneratePO(item)}
                            disabled={item.currentStock >= item.reorderPoint}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            PO
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNotifySupplier(item)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Reorder Settings: {item.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Reorder Point</Label>
                                  <Input 
                                    type="number" 
                                    defaultValue={item.reorderPoint}
                                    placeholder="Minimum stock level"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Alert when stock falls below this level
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label>Reorder Quantity</Label>
                                  <Input 
                                    type="number" 
                                    defaultValue={item.reorderQuantity}
                                    placeholder="Quantity to order"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Quantity to order when reorder point is reached
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label>Supplier Email</Label>
                                  <Input 
                                    type="email" 
                                    defaultValue={item.supplierEmail}
                                    placeholder="supplier@example.com"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Lead Time</Label>
                                  <Input 
                                    defaultValue={item.leadTime}
                                    placeholder="e.g., 7 days"
                                  />
                                </div>
                                <Button 
                                  className="w-full bg-gradient-primary"
                                  onClick={handleUpdateReorderPoint}
                                >
                                  Update Settings
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Stock</p>
                      <p className="font-semibold">{item.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reorder Point</p>
                      <p className="font-semibold">{item.reorderPoint}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleGeneratePO(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Generate PO
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNotifySupplier(item)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Recent Reorder Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Auto PO Generated", item: "Wireless Keyboard", qty: 30, time: "5 minutes ago", type: "success" },
                { action: "Low Stock Alert", item: "Laptop Pro 15", qty: 5, time: "15 minutes ago", type: "warning" },
                { action: "Supplier Notified", item: "Monitor 27 inch", qty: 15, time: "1 hour ago", type: "info" },
                { action: "Out of Stock", item: "Gaming Mouse", qty: 0, time: "2 hours ago", type: "error" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    activity.type === 'success' ? 'bg-success/10' :
                    activity.type === 'warning' ? 'bg-warning/10' :
                    activity.type === 'error' ? 'bg-destructive/10' :
                    'bg-primary/10'
                  }`}>
                    {activity.type === 'success' ? <ShoppingCart className="h-5 w-5 text-success" /> :
                     activity.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-warning" /> :
                     activity.type === 'error' ? <Package className="h-5 w-5 text-destructive" /> :
                     <Mail className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.item} - {activity.qty} units • {activity.time}
                    </p>
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
