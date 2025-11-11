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
import { Plus, ShoppingBag, FileText, Clock, CheckCircle2, Eye, Edit, Trash2 } from "lucide-react";

const stats = [
  { title: "Total Purchase", value: "Rs 8,923,400", icon: ShoppingBag, color: "text-primary" },
  { title: "Purchase Orders", value: "89", icon: FileText, color: "text-primary" },
  { title: "Pending", value: "12", icon: Clock, color: "text-warning" },
  { title: "Received", value: "77", icon: CheckCircle2, color: "text-success" },
];

const initialPurchaseOrders = [
  { id: "PO-001", vendor: "Karachi Suppliers", amount: "Rs 1,250,000", date: "2024-01-15", status: "received" },
  { id: "PO-002", vendor: "Lahore Wholesale", amount: "Rs 820,000", date: "2024-01-14", status: "pending" },
  { id: "PO-003", vendor: "Pakistan Trade", amount: "Rs 1,580,000", date: "2024-01-13", status: "received" },
  { id: "PO-004", vendor: "Multan Vendors", amount: "Rs 690,000", date: "2024-01-12", status: "pending" },
  { id: "PO-005", vendor: "Peshawar Supplies", amount: "Rs 910,000", date: "2024-01-11", status: "received" },
];

interface PurchaseOrder {
  id: string;
  vendor: string;
  amount: string;
  date: string;
  status: string;
}

export default function Purchase() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState(initialPurchaseOrders);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vendor, setVendor] = useState("");
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState("");

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
        status: "pending"
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

        {/* Purchase Orders Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.vendor}</TableCell>
                      <TableCell>{po.amount}</TableCell>
                      <TableCell>{po.date}</TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {po.status === "pending" && (
                            <Button variant="ghost" size="icon" title="Mark as Received" onClick={() => handleReceive(po.id)}>
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(po)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(po.id)}>
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
              {orders.map((po) => (
                <div key={po.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{po.id}</p>
                      <p className="text-sm text-muted-foreground">{po.vendor}</p>
                    </div>
                    {getStatusBadge(po.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{po.date}</span>
                    <span className="font-bold text-lg">{po.amount}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
