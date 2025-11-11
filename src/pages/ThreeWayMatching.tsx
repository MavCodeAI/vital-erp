import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showSuccess, showError } from "@/lib/toast";
import { 
  FileText, 
  Package, 
  Receipt,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Check
} from "lucide-react";

const stats = [
  { title: "Matched", value: "45", change: "+12", trend: "up", icon: CheckCircle, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Pending Match", value: "8", change: "+3", trend: "up", icon: AlertTriangle, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Discrepancies", value: "3", change: "-1", trend: "down", icon: XCircle, color: "text-destructive", bgColor: "bg-red-500/10" },
  { title: "This Month", value: "56", change: "+14", trend: "up", icon: FileText, color: "text-primary", bgColor: "bg-blue-500/10" },
];

const matchingRecords = [
  {
    id: "MATCH-001",
    poNumber: "PO-045",
    receiptNumber: "REC-123",
    invoiceNumber: "INV-789",
    vendor: "Tech Suppliers Ltd",
    item: "Laptop Pro 15",
    poQty: 50,
    receivedQty: 50,
    invoicedQty: 50,
    poAmount: "Rs 6,250,000",
    receivedAmount: "Rs 6,250,000",
    invoicedAmount: "Rs 6,250,000",
    status: "matched",
    matchDate: "2024-01-15",
    discrepancy: null
  },
  {
    id: "MATCH-002",
    poNumber: "PO-046",
    receiptNumber: "REC-124",
    invoiceNumber: "INV-790",
    vendor: "Display Solutions",
    item: "Monitor 27 inch",
    poQty: 30,
    receivedQty: 28,
    invoicedQty: 30,
    poAmount: "Rs 1,350,000",
    receivedAmount: "Rs 1,260,000",
    invoicedAmount: "Rs 1,350,000",
    status: "discrepancy",
    matchDate: "2024-01-14",
    discrepancy: "Quantity mismatch: Received 28 but invoiced for 30"
  },
  {
    id: "MATCH-003",
    poNumber: "PO-047",
    receiptNumber: "REC-125",
    invoiceNumber: null,
    vendor: "Peripherals Inc",
    item: "Wireless Keyboard",
    poQty: 100,
    receivedQty: 100,
    invoicedQty: null,
    poAmount: "Rs 350,000",
    receivedAmount: "Rs 350,000",
    invoicedAmount: null,
    status: "pending",
    matchDate: null,
    discrepancy: "Awaiting vendor invoice"
  },
  {
    id: "MATCH-004",
    poNumber: "PO-048",
    receiptNumber: "REC-126",
    invoiceNumber: "INV-791",
    vendor: "Gaming Gear Co",
    item: "Gaming Mouse",
    poQty: 75,
    receivedQty: 75,
    invoicedQty: 75,
    poAmount: "Rs 562,500",
    receivedAmount: "Rs 562,500",
    invoicedAmount: "Rs 575,000",
    status: "discrepancy",
    matchDate: "2024-01-13",
    discrepancy: "Price mismatch: Invoice amount Rs 12,500 higher"
  },
  {
    id: "MATCH-005",
    poNumber: "PO-049",
    receiptNumber: null,
    invoiceNumber: null,
    vendor: "Storage Solutions",
    item: "External HDD 2TB",
    poQty: 40,
    receivedQty: null,
    invoicedQty: null,
    poAmount: "Rs 800,000",
    receivedAmount: null,
    invoicedAmount: null,
    status: "pending",
    matchDate: null,
    discrepancy: "Awaiting goods receipt"
  },
];

export default function ThreeWayMatching() {
  const [records, setRecords] = useState(matchingRecords);
  const [selectedRecord, setSelectedRecord] = useState<typeof matchingRecords[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRecords = records.filter(r => 
    filterStatus === "all" || r.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      matched: { variant: "default" as const, label: "Matched", icon: CheckCircle, color: "text-success" },
      pending: { variant: "secondary" as const, label: "Pending", icon: AlertTriangle, color: "text-warning" },
      discrepancy: { variant: "destructive" as const, label: "Discrepancy", icon: XCircle, color: "text-destructive" }
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
    setRecords(records.map(r => 
      r.id === id ? { ...r, status: "matched", matchDate: new Date().toISOString().split('T')[0] } : r
    ));
    showSuccess("Match approved and recorded!");
  };

  const handleReject = (id: string) => {
    if (confirm("Are you sure you want to reject this match?")) {
      showSuccess("Match rejected. Vendor will be notified.");
    }
  };

  const handleResolve = (id: string) => {
    showSuccess("Discrepancy resolution process initiated!");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Three-Way Matching</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Match Purchase Orders, Receipts, and Invoices
          </p>
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

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">What is Three-Way Matching?</h3>
                <p className="text-sm text-muted-foreground">
                  Three-way matching compares Purchase Order, Goods Receipt, and Vendor Invoice to ensure:
                  <br />• Quantities match across all three documents
                  <br />• Prices are consistent with the PO
                  <br />• Only received goods are paid for
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matching Records */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Matching Records</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "matched" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("matched")}
                >
                  Matched
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "discrepancy" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("discrepancy")}
                >
                  Discrepancies
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Match ID</TableHead>
                    <TableHead className="font-semibold">PO / Receipt / Invoice</TableHead>
                    <TableHead className="font-semibold">Vendor</TableHead>
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">Qty (PO/Rec/Inv)</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-primary">{record.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{record.poNumber}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>{record.receiptNumber || "—"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Receipt className="h-3 w-3" />
                            <span>{record.invoiceNumber || "—"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{record.vendor}</TableCell>
                      <TableCell>{record.item}</TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>{record.poQty}</div>
                          <div className={record.receivedQty !== record.poQty ? "text-warning" : ""}>
                            {record.receivedQty || "—"}
                          </div>
                          <div className={record.invoicedQty !== record.poQty ? "text-warning" : ""}>
                            {record.invoicedQty || "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.poAmount}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRecord(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Match Details: {record.id}</DialogTitle>
                              </DialogHeader>
                              {selectedRecord && (
                                <div className="space-y-6 py-4">
                                  {/* Three Documents Comparison */}
                                  <div className="grid grid-cols-3 gap-4">
                                    {/* PO Column */}
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2 font-semibold">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <span>Purchase Order</span>
                                      </div>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <p className="text-muted-foreground">PO Number</p>
                                          <p className="font-medium">{selectedRecord.poNumber}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Quantity</p>
                                          <p className="font-medium">{selectedRecord.poQty}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Amount</p>
                                          <p className="font-medium">{selectedRecord.poAmount}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Receipt Column */}
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2 font-semibold">
                                        <Package className="h-4 w-4 text-success" />
                                        <span>Goods Receipt</span>
                                      </div>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <p className="text-muted-foreground">Receipt Number</p>
                                          <p className="font-medium">{selectedRecord.receiptNumber || "—"}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Quantity</p>
                                          <p className={`font-medium ${selectedRecord.receivedQty !== selectedRecord.poQty ? "text-warning" : ""}`}>
                                            {selectedRecord.receivedQty || "—"}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Amount</p>
                                          <p className="font-medium">{selectedRecord.receivedAmount || "—"}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Invoice Column */}
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2 font-semibold">
                                        <Receipt className="h-4 w-4 text-warning" />
                                        <span>Vendor Invoice</span>
                                      </div>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <p className="text-muted-foreground">Invoice Number</p>
                                          <p className="font-medium">{selectedRecord.invoiceNumber || "—"}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Quantity</p>
                                          <p className={`font-medium ${selectedRecord.invoicedQty !== selectedRecord.poQty ? "text-warning" : ""}`}>
                                            {selectedRecord.invoicedQty || "—"}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Amount</p>
                                          <p className={`font-medium ${selectedRecord.invoicedAmount !== selectedRecord.poAmount ? "text-warning" : ""}`}>
                                            {selectedRecord.invoicedAmount || "—"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Discrepancy Alert */}
                                  {selectedRecord.discrepancy && (
                                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                        <div>
                                          <p className="font-semibold text-destructive mb-1">Discrepancy Detected</p>
                                          <p className="text-sm">{selectedRecord.discrepancy}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Actions */}
                                  <div className="flex gap-2">
                                    {selectedRecord.status === "pending" && (
                                      <Button
                                        className="flex-1 bg-gradient-primary"
                                        onClick={() => handleApprove(selectedRecord.id)}
                                      >
                                        <Check className="mr-2 h-4 w-4" />
                                        Approve Match
                                      </Button>
                                    )}
                                    {selectedRecord.status === "discrepancy" && (
                                      <>
                                        <Button
                                          variant="outline"
                                          className="flex-1"
                                          onClick={() => handleResolve(selectedRecord.id)}
                                        >
                                          Resolve Discrepancy
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleReject(selectedRecord.id)}
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          {record.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(record.id)}
                            >
                              Approve
                            </Button>
                          )}
                          {record.status === "discrepancy" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolve(record.id)}
                            >
                              Resolve
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
            <div className="lg:hidden space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{record.id}</p>
                      <p className="text-sm text-muted-foreground">{record.vendor}</p>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{record.item}</p>
                    <p className="text-muted-foreground">Qty: {record.poQty} / {record.receivedQty || "—"} / {record.invoicedQty || "—"}</p>
                  </div>
                  {record.discrepancy && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded p-2 text-xs">
                      {record.discrepancy}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {record.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleApprove(record.id)}
                      >
                        Approve
                      </Button>
                    )}
                    {record.status === "discrepancy" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleResolve(record.id)}
                      >
                        Resolve
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
