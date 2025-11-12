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
  Warehouse, 
  ArrowRightLeft, 
  Package, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const stats = [
  { title: "Pending Transfers", value: "8", change: "+3", trend: "up", icon: Clock, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "In Transit", value: "5", change: "+2", trend: "up", icon: Truck, color: "text-primary", bgColor: "bg-blue-500/10" },
  { title: "Completed Today", value: "12", change: "+5", trend: "up", icon: CheckCircle, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Total Warehouses", value: "4", change: "+0", trend: "up", icon: Warehouse, color: "text-primary", bgColor: "bg-purple-500/10" },
];

const warehouses = [
  { id: "WH-001", name: "Main Warehouse", location: "Karachi", capacity: "10,000 sq ft", items: 2341 },
  { id: "WH-002", name: "North Branch", location: "Lahore", capacity: "8,000 sq ft", items: 1856 },
  { id: "WH-003", name: "South Branch", location: "Islamabad", capacity: "6,500 sq ft", items: 1234 },
  { id: "WH-004", name: "Distribution Center", location: "Faisalabad", capacity: "12,000 sq ft", items: 987 },
];

const initialTransfers = [
  {
    id: "TRF-001",
    fromWarehouse: "Main Warehouse",
    toWarehouse: "North Branch",
    item: "Laptop Pro 15",
    quantity: 25,
    requestDate: "2024-01-15",
    expectedDate: "2024-01-18",
    status: "pending",
    requestedBy: "Ahmed Khan",
    notes: "Urgent transfer for new store opening"
  },
  {
    id: "TRF-002",
    fromWarehouse: "North Branch",
    toWarehouse: "South Branch",
    item: "Monitor 27 inch",
    quantity: 15,
    requestDate: "2024-01-14",
    expectedDate: "2024-01-17",
    status: "in-transit",
    requestedBy: "Fatima Ali",
    notes: "Regular stock replenishment"
  },
  {
    id: "TRF-003",
    fromWarehouse: "Main Warehouse",
    toWarehouse: "Distribution Center",
    item: "Wireless Keyboard",
    quantity: 50,
    requestDate: "2024-01-13",
    expectedDate: "2024-01-16",
    status: "in-transit",
    requestedBy: "Hassan Raza",
    notes: "Bulk transfer for distribution"
  },
  {
    id: "TRF-004",
    fromWarehouse: "South Branch",
    toWarehouse: "Main Warehouse",
    item: "Gaming Mouse",
    quantity: 30,
    requestDate: "2024-01-12",
    expectedDate: "2024-01-15",
    status: "completed",
    requestedBy: "Ayesha Malik",
    notes: "Return excess stock"
  },
  {
    id: "TRF-005",
    fromWarehouse: "Distribution Center",
    toWarehouse: "North Branch",
    item: "External HDD 2TB",
    quantity: 20,
    requestDate: "2024-01-11",
    expectedDate: "2024-01-14",
    status: "completed",
    requestedBy: "Usman Tariq",
    notes: "Customer order fulfillment"
  },
];

export default function WarehouseTransfers() {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [selectedTransfer, setSelectedTransfer] = useState<typeof initialTransfers[0] | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTransfers = transfers.filter(t => 
    filterStatus === "all" || t.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Pending", icon: Clock },
      "in-transit": { variant: "default" as const, label: "In Transit", icon: Truck },
      completed: { variant: "default" as const, label: "Completed", icon: CheckCircle },
      cancelled: { variant: "destructive" as const, label: "Cancelled", icon: XCircle }
    };
    const config = variants[status as keyof typeof variants] || variants.pending;
    return (
      <Badge variant={config.variant} className="gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleApprove = (id: string) => {
    setTransfers(transfers.map(t => 
      t.id === id ? { ...t, status: "in-transit" } : t
    ));
    showSuccess("Transfer approved and marked as in-transit!");
  };

  const handleComplete = (id: string) => {
    setTransfers(transfers.map(t => 
      t.id === id ? { ...t, status: "completed" } : t
    ));
    showSuccess("Transfer marked as completed!");
  };

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this transfer?")) {
      setTransfers(transfers.map(t => 
        t.id === id ? { ...t, status: "cancelled" } : t
      ));
      showSuccess("Transfer cancelled!");
    }
  };

  const handleCreateTransfer = () => {
    showSuccess("Transfer request created successfully!");
    setIsCreating(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Warehouse Transfers</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage inter-warehouse inventory transfers
            </p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                New Transfer Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Transfer Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Warehouse *</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select warehouse</option>
                      {warehouses.map(wh => (
                        <option key={wh.id} value={wh.id}>{wh.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>To Warehouse *</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select warehouse</option>
                      {warehouses.map(wh => (
                        <option key={wh.id} value={wh.id}>{wh.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Item *</Label>
                  <Input placeholder="Search or select item" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input type="number" placeholder="Enter quantity" />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Date *</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Add any notes or special instructions"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTransfer} className="flex-1 bg-gradient-primary">
                    Create Transfer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Warehouses Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {warehouses.map((warehouse) => (
            <Card key={warehouse.id} className="shadow-soft hover:shadow-elevated transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Warehouse className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{warehouse.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{warehouse.location}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium">{warehouse.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">{warehouse.items.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transfers Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                <CardTitle>Transfer Requests</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "in-transit" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("in-transit")}
                >
                  In Transit
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Transfer ID</TableHead>
                    <TableHead className="font-semibold">From → To</TableHead>
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Expected Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-primary">{transfer.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{transfer.fromWarehouse}</span>
                          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{transfer.toWarehouse}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{transfer.item}</TableCell>
                      <TableCell>{transfer.quantity}</TableCell>
                      <TableCell>{transfer.expectedDate}</TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedTransfer(transfer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Transfer Details: {transfer.id}</DialogTitle>
                              </DialogHeader>
                              {selectedTransfer && (
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground mb-1">From</p>
                                      <p className="font-medium">{selectedTransfer.fromWarehouse}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground mb-1">To</p>
                                      <p className="font-medium">{selectedTransfer.toWarehouse}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground mb-1">Item</p>
                                      <p className="font-medium">{selectedTransfer.item}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground mb-1">Quantity</p>
                                      <p className="font-medium">{selectedTransfer.quantity}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground mb-1">Request Date</p>
                                      <p className="font-medium">{selectedTransfer.requestDate}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground mb-1">Expected Date</p>
                                      <p className="font-medium">{selectedTransfer.expectedDate}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground mb-1">Requested By</p>
                                      <p className="font-medium">{selectedTransfer.requestedBy}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground mb-1">Status</p>
                                      {getStatusBadge(selectedTransfer.status)}
                                    </div>
                                  </div>
                                  {selectedTransfer.notes && (
                                    <div>
                                      <p className="text-muted-foreground text-sm mb-1">Notes</p>
                                      <p className="text-sm">{selectedTransfer.notes}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          {transfer.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(transfer.id)}
                            >
                              Approve
                            </Button>
                          )}
                          {transfer.status === "in-transit" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleComplete(transfer.id)}
                            >
                              Complete
                            </Button>
                          )}
                          {transfer.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(transfer.id)}
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {filteredTransfers.map((transfer) => (
                <div key={transfer.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{transfer.id}</p>
                      <p className="text-sm text-muted-foreground">{transfer.item}</p>
                    </div>
                    {getStatusBadge(transfer.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{transfer.fromWarehouse}</span>
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>{transfer.toWarehouse}</span>
                  </div>
                  <div className="flex gap-2">
                    {transfer.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleApprove(transfer.id)}
                      >
                        Approve
                      </Button>
                    )}
                    {transfer.status === "in-transit" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleComplete(transfer.id)}
                      >
                        Complete
                      </Button>
                    )}
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
