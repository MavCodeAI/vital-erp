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
import { Plus, DollarSign, FileText, Clock, CheckCircle2, Eye, Edit, Trash2 } from "lucide-react";

// Available products from inventory
const availableProducts = [
  { id: "ITM-001", name: "Laptop Pro 15", sku: "LP-15-001", price: 85000, stock: 45 },
  { id: "ITM-002", name: "Wireless Mouse", sku: "WM-002", price: 2500, stock: 8 },
  { id: "ITM-003", name: "USB-C Cable", sku: "UC-003", price: 800, stock: 150 },
  { id: "ITM-004", name: "Monitor 27\"", sku: "MN-27-004", price: 45000, stock: 0 },
  { id: "ITM-005", name: "Keyboard Mechanical", sku: "KB-MEC-005", price: 12000, stock: 32 },
  { id: "ITM-006", name: "Webcam HD", sku: "WC-HD-006", price: 8500, stock: 25 },
  { id: "ITM-007", name: "Headphones Wireless", sku: "HP-WL-007", price: 6500, stock: 40 },
  { id: "ITM-008", name: "External SSD 1TB", sku: "SSD-1TB-008", price: 18000, stock: 15 },
];

const stats = [
  { title: "Total Sales", value: "Rs 12,456,200", icon: DollarSign, color: "text-success" },
  { title: "Invoices", value: "156", icon: FileText, color: "text-primary" },
  { title: "Pending", value: "23", icon: Clock, color: "text-warning" },
  { title: "Paid", value: "133", icon: CheckCircle2, color: "text-success" },
];

const initialInvoices = [
  { id: "INV-001", customer: "Karachi Traders", amount: "Rs 250,000", date: "2024-01-15", status: "paid" },
  { id: "INV-002", customer: "Lahore Tech Solutions", amount: "Rs 520,000", date: "2024-01-14", status: "pending" },
  { id: "INV-003", customer: "Islamabad Industries", amount: "Rs 380,000", date: "2024-01-13", status: "paid" },
  { id: "INV-004", customer: "Faisalabad Systems", amount: "Rs 190,000", date: "2024-01-12", status: "overdue" },
  { id: "INV-005", customer: "Rawalpindi Media", amount: "Rs 410,000", date: "2024-01-11", status: "paid" },
];

interface InvoiceItem {
  productId?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  customer: string;
  amount: string;
  date: string;
  status: string;
}

export default function Sales() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(17); // GST 17% in Pakistan
  const [customer, setCustomer] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    setItems(newItems);
  };

  const selectProduct = (index: number, productId: string) => {
    const product = availableProducts.find(p => p.id === productId);
    if (product) {
      const newItems = [...items];
      newItems[index] = {
        productId: product.id,
        description: `${product.name} (${product.sku})`,
        quantity: 1,
        rate: product.price,
        amount: product.price
      };
      setItems(newItems);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handleCreate = () => {
    if (!customer) {
      showError("Please select a customer");
      return;
    }
    if (items.every(item => !item.description)) {
      showError("Please add at least one item");
      return;
    }

    if (editingId) {
      // Update existing invoice
      setInvoices(invoices.map(inv => 
        inv.id === editingId 
          ? {
              ...inv,
              customer: customer,
              amount: `Rs ${total.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`,
              date: invoiceDate,
            }
          : inv
      ));
      showSuccess("Invoice updated successfully!");
    } else {
      // Create new invoice
      const newInvoice = {
        id: `INV-${Date.now().toString().slice(-6)}`,
        customer: customer,
        amount: `Rs ${total.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`,
        date: invoiceDate,
        status: "pending"
      };
      setInvoices([newInvoice, ...invoices]);
      showSuccess("Invoice created successfully!");
    }

    resetForm();
    setOpen(false);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingId(invoice.id);
    setCustomer(invoice.customer);
    setInvoiceDate(invoice.date);
    // Parse amount and set items (simplified for demo)
    const amount = parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""));
    setItems([{ description: "Previous items", quantity: 1, rate: amount, amount: amount }]);
    setOpen(true);
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewOpen(true);
  };

  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.amount.replace(/[^0-9.-]+/g, ""));
    setPaymentOpen(true);
  };

  const processPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      showError("Please enter a valid payment amount");
      return;
    }

    setInvoices(invoices.map(inv => 
      inv.id === selectedInvoice.id 
        ? { ...inv, status: "paid" }
        : inv
    ));
    showSuccess(`Payment of Rs ${parseFloat(paymentAmount).toLocaleString('en-PK')} received successfully!`);
    setPaymentOpen(false);
    setPaymentAmount("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices(invoices.filter(inv => inv.id !== id));
      showSuccess("Invoice deleted successfully!");
    }
  };

  const shareInvoice = () => {
    showSuccess("Invoice link copied to clipboard! You can share it via WhatsApp, Email, or SMS.");
  };

  const resetForm = () => {
    setItems([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
    setDiscount(0);
    setTaxRate(17);
    setCustomer("");
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setDueDate("");
    setEditingId(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      paid: { variant: "default", label: "Paid" },
      pending: { variant: "secondary", label: "Pending" },
      overdue: { variant: "destructive", label: "Overdue" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sales</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage invoices and sales orders</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl">{editingId ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Customer & Date Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer" className="text-sm font-semibold">Customer *</Label>
                    <select 
                      id="customer"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select customer</option>
                      <option value="Karachi Traders">Karachi Traders</option>
                      <option value="Lahore Tech Solutions">Lahore Tech Solutions</option>
                      <option value="Islamabad Industries">Islamabad Industries</option>
                      <option value="Faisalabad Systems">Faisalabad Systems</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-semibold">Invoice Date *</Label>
                    <Input id="date" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date" className="text-sm font-semibold">Due Date *</Label>
                    <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-no" className="text-sm font-semibold">Invoice Number</Label>
                    <Input id="invoice-no" defaultValue={`INV-${Date.now().toString().slice(-6)}`} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="po-ref" className="text-sm font-semibold">PO Reference (Optional)</Label>
                    <Input id="po-ref" placeholder="Customer PO number" />
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Invoice Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Add Item</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                  
                  {/* Desktop View */}
                  <div className="hidden md:block border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 grid grid-cols-12 gap-2 p-3 text-sm font-semibold">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-center">Rate (Rs)</div>
                      <div className="col-span-2 text-right">Amount (Rs)</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    <div className="divide-y">
                      {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 p-3 items-center">
                          <div className="col-span-4 space-y-2">
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={item.productId || ""}
                              onChange={(e) => {
                                if (e.target.value) {
                                  selectProduct(index, e.target.value);
                                } else {
                                  updateItem(index, "description", "");
                                }
                              }}
                            >
                              <option value="">Select product or enter custom</option>
                              {availableProducts.map(product => (
                                <option key={product.id} value={product.id} disabled={product.stock === 0}>
                                  {product.name} - Rs {product.price.toLocaleString()} {product.stock === 0 ? '(Out of Stock)' : `(Stock: ${product.stock})`}
                                </option>
                              ))}
                            </select>
                            {!item.productId && (
                              <Input
                                placeholder="Or enter custom item description"
                                value={item.description}
                                onChange={(e) => updateItem(index, "description", e.target.value)}
                                className="text-sm"
                              />
                            )}
                            {item.productId && (
                              <p className="text-xs text-muted-foreground px-1">{item.description}</p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                              className="text-center"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                              className="text-center"
                            />
                          </div>
                          <div className="col-span-2 text-right font-semibold">
                            Rs {item.amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-semibold text-muted-foreground">Item #{index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Product</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={item.productId || ""}
                            onChange={(e) => {
                              if (e.target.value) {
                                selectProduct(index, e.target.value);
                              } else {
                                updateItem(index, "description", "");
                              }
                            }}
                          >
                            <option value="">Select product</option>
                            {availableProducts.map(product => (
                              <option key={product.id} value={product.id} disabled={product.stock === 0}>
                                {product.name} - Rs {product.price.toLocaleString()}
                              </option>
                            ))}
                          </select>
                          {!item.productId && (
                            <Input
                              placeholder="Or enter custom description"
                              value={item.description}
                              onChange={(e) => updateItem(index, "description", e.target.value)}
                              className="text-sm"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Rate (Rs)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-medium">Amount:</span>
                          <span className="text-lg font-bold">Rs {item.amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculations */}
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Subtotal:</span>
                      <span className="font-semibold">Rs {subtotal.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="discount" className="text-sm">Discount (%):</Label>
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </div>
                      <span className="font-semibold text-destructive">- Rs {discountAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="tax" className="text-sm">GST (%):</Label>
                        <Input
                          id="tax"
                          type="number"
                          min="0"
                          max="100"
                          value={taxRate}
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </div>
                      <span className="font-semibold text-success">+ Rs {taxAmount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold">Total Amount:</span>
                      <span className="text-2xl font-bold text-primary">Rs {total.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Notes & Terms */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold">Notes / Terms & Conditions</Label>
                  <textarea
                    id="notes"
                    placeholder="Payment terms, delivery notes, or other information..."
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-primary" onClick={handleCreate}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {editingId ? "Update Invoice" : "Create Invoice"}
                    </Button>
                  </div>
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

        {/* Invoices Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Invoice" onClick={() => handleView(invoice)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.status !== "paid" && (
                            <Button variant="ghost" size="icon" title="Receive Payment" onClick={() => handlePayment(invoice)}>
                              <DollarSign className="h-4 w-4 text-success" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(invoice)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(invoice.id)}>
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
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{invoice.date}</span>
                    <span className="font-bold text-lg">{invoice.amount}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(invoice)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {invoice.status !== "paid" && (
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePayment(invoice)}>
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(invoice)}>
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice View Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Invoice Details</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6 py-4">
                {/* Invoice Header */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold text-primary">INVOICE</h3>
                      <p className="text-sm text-muted-foreground mt-1">ErpMax Pakistan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{selectedInvoice.id}</p>
                      <p className="text-sm text-muted-foreground">Date: {selectedInvoice.date}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Bill To:</p>
                    <p className="text-lg font-semibold mt-1">{selectedInvoice.customer}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm font-semibold text-muted-foreground">Status:</p>
                    <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                  </div>
                </div>

                {/* Invoice Amount */}
                <div className="bg-muted/20 rounded-lg p-6 border-2 border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-3xl font-bold text-primary">{selectedInvoice.amount}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button className="flex-1" variant="outline" onClick={shareInvoice}>
                    Share Invoice
                  </Button>
                  {selectedInvoice.status !== "paid" && (
                    <Button className="flex-1 bg-gradient-primary" onClick={() => {
                      setViewOpen(false);
                      handlePayment(selectedInvoice);
                    }}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Receive Payment
                    </Button>
                  )}
                  {selectedInvoice.status === "paid" && (
                    <Button className="flex-1 bg-success" disabled>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Paid
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Collection Dialog */}
        <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Receive Payment</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6 py-4">
                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Invoice:</span>
                      <span className="font-semibold">{selectedInvoice.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Customer:</span>
                      <span className="font-semibold">{selectedInvoice.customer}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm text-muted-foreground">Amount Due:</span>
                      <span className="text-xl font-bold text-primary">{selectedInvoice.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-amount" className="text-sm font-semibold">Payment Amount (Rs) *</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method" className="text-sm font-semibold">Payment Method</Label>
                  <select
                    id="payment-method"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-notes" className="text-sm font-semibold">Notes (Optional)</Label>
                  <Input id="payment-notes" placeholder="Payment reference or notes" />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setPaymentOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-gradient-primary" onClick={processPayment}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirm Payment
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
