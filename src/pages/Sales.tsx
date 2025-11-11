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
import { Plus, DollarSign, FileText, Clock, CheckCircle2, Eye, Edit, Trash2, TrendingUp, ArrowUpRight, Filter, Download, Search, FileSpreadsheet, FileDown, Share2, Mail, MessageSquare, Link2, Printer, Send } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

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
  { title: "Total Sales", value: "Rs 12,456,200", change: "+12.5%", trend: "up", icon: DollarSign, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Invoices", value: "156", change: "+8", trend: "up", icon: FileText, color: "text-primary", bgColor: "bg-blue-500/10" },
  { title: "Pending", value: "23", change: "-5", trend: "down", icon: Clock, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Paid", value: "133", change: "+13", trend: "up", icon: CheckCircle2, color: "text-success", bgColor: "bg-green-500/10" },
];

const monthlySalesData = [
  { month: "Jan", sales: 850000, invoices: 24 },
  { month: "Feb", sales: 920000, invoices: 28 },
  { month: "Mar", sales: 780000, invoices: 22 },
  { month: "Apr", sales: 1050000, invoices: 32 },
  { month: "May", sales: 980000, invoices: 29 },
  { month: "Jun", sales: 1150000, invoices: 35 },
];

const customerSalesData = [
  { name: "Karachi Traders", value: 2500000, color: "hsl(var(--primary))" },
  { name: "Lahore Tech", value: 1800000, color: "hsl(142, 76%, 36%)" },
  { name: "Islamabad Ind.", value: 1500000, color: "hsl(48, 96%, 53%)" },
  { name: "Others", value: 3200000, color: "hsl(221, 83%, 53%)" },
];

const initialInvoices = [
  { id: "INV-001", customer: "Karachi Traders", amount: "Rs 250,000", date: "2024-01-15", dueDate: "2024-02-15", status: "paid", items: 5 },
  { id: "INV-002", customer: "Lahore Tech Solutions", amount: "Rs 520,000", date: "2024-01-14", dueDate: "2024-02-14", status: "pending", items: 8 },
  { id: "INV-003", customer: "Islamabad Industries", amount: "Rs 380,000", date: "2024-01-13", dueDate: "2024-02-13", status: "paid", items: 6 },
  { id: "INV-004", customer: "Faisalabad Systems", amount: "Rs 190,000", date: "2024-01-12", dueDate: "2024-01-20", status: "overdue", items: 3 },
  { id: "INV-005", customer: "Rawalpindi Media", amount: "Rs 410,000", date: "2024-01-11", dueDate: "2024-02-11", status: "paid", items: 7 },
  { id: "INV-006", customer: "Multan Enterprises", amount: "Rs 675,000", date: "2024-01-10", dueDate: "2024-02-10", status: "paid", items: 12 },
  { id: "INV-007", customer: "Peshawar Tech Hub", amount: "Rs 295,000", date: "2024-01-09", dueDate: "2024-02-09", status: "pending", items: 4 },
  { id: "INV-008", customer: "Quetta Solutions", amount: "Rs 145,000", date: "2024-01-08", dueDate: "2024-01-18", status: "overdue", items: 2 },
  { id: "INV-009", customer: "Sialkot Industries", amount: "Rs 825,000", date: "2024-01-07", dueDate: "2024-02-07", status: "paid", items: 15 },
  { id: "INV-010", customer: "Gujranwala Corp", amount: "Rs 340,000", date: "2024-01-06", dueDate: "2024-02-06", status: "pending", items: 5 },
  { id: "INV-011", customer: "Hyderabad Systems", amount: "Rs 480,000", date: "2024-01-05", dueDate: "2024-02-05", status: "paid", items: 9 },
  { id: "INV-012", customer: "Sukkur Technologies", amount: "Rs 215,000", date: "2024-01-04", dueDate: "2024-02-04", status: "pending", items: 3 },
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
  dueDate: string;
  status: string;
  items: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Invoice ID', 'Customer', 'Items', 'Amount', 'Invoice Date', 'Due Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredInvoices.map(inv => 
        [inv.id, `"${inv.customer}"`, inv.items, inv.amount.replace(/,/g, ''), inv.date, inv.dueDate, inv.status].join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess('Invoices exported to Excel successfully!');
  };

  const exportToPDF = () => {
    // Create a printable HTML content
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
      showError('Please allow pop-ups to export PDF');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Invoices Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; text-align: center; margin-bottom: 30px; }
          .header { text-align: center; margin-bottom: 20px; }
          .date { color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f3f4f6; padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
          td { padding: 10px; border: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .status-paid { color: #16a34a; font-weight: bold; }
          .status-pending { color: #eab308; font-weight: bold; }
          .status-overdue { color: #dc2626; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sales Invoices Report</h1>
          <p class="date">Generated on: ${new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p class="date">Total Invoices: ${filteredInvoices.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredInvoices.map(inv => `
              <tr>
                <td>${inv.id}</td>
                <td>${inv.customer}</td>
                <td>${inv.items}</td>
                <td>${inv.amount}</td>
                <td>${inv.date}</td>
                <td>${inv.dueDate}</td>
                <td class="status-${inv.status}">${inv.status.toUpperCase()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>ErpMax Pakistan - Sales Management System</p>
          <p>This is a computer-generated report</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      showSuccess('PDF export initiated. Please save the PDF from print dialog.');
    }, 250);
  };

  const exportSingleInvoicePDF = (invoice: Invoice) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
      showError('Please allow pop-ups to export PDF');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .invoice-header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #333; padding-bottom: 20px; }
          .invoice-title { font-size: 36px; color: #333; margin: 0; }
          .company-name { color: #666; margin-top: 10px; }
          .invoice-details { display: flex; justify-content: space-between; margin: 30px 0; }
          .detail-section { flex: 1; }
          .detail-label { color: #666; font-size: 12px; text-transform: uppercase; }
          .detail-value { font-size: 18px; font-weight: bold; margin-top: 5px; }
          .amount-box { background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
          .amount-label { color: #666; font-size: 14px; }
          .amount-value { font-size: 32px; font-weight: bold; color: #333; margin-top: 10px; }
          .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-top: 10px; }
          .status-paid { background: #dcfce7; color: #16a34a; }
          .status-pending { background: #fef3c7; color: #eab308; }
          .status-overdue { background: #fee2e2; color: #dc2626; }
          .footer { margin-top: 60px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1 class="invoice-title">INVOICE</h1>
          <p class="company-name">ErpMax Pakistan</p>
        </div>
        <div class="invoice-details">
          <div class="detail-section">
            <div class="detail-label">Invoice Number</div>
            <div class="detail-value">${invoice.id}</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">Invoice Date</div>
            <div class="detail-value">${invoice.date}</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">Due Date</div>
            <div class="detail-value">${invoice.dueDate}</div>
          </div>
        </div>
        <div class="invoice-details">
          <div class="detail-section">
            <div class="detail-label">Bill To</div>
            <div class="detail-value">${invoice.customer}</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">Items</div>
            <div class="detail-value">${invoice.items} items</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">Status</div>
            <div class="status status-${invoice.status}">${invoice.status.toUpperCase()}</div>
          </div>
        </div>
        <div class="amount-box">
          <div class="amount-label">Total Amount</div>
          <div class="amount-value">${invoice.amount}</div>
        </div>
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>ErpMax Pakistan - Sales Management System</p>
          <p>Generated on: ${new Date().toLocaleDateString('en-PK')}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

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
        dueDate: dueDate || new Date(new Date(invoiceDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "pending",
        items: items.filter(item => item.description).length
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

  const shareViaWhatsApp = (invoice: Invoice) => {
    const message = `Invoice ${invoice.id}\nCustomer: ${invoice.customer}\nAmount: ${invoice.amount}\nDate: ${invoice.date}\n\nView invoice: https://erp.example.com/invoice/${invoice.id}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showSuccess('Opening WhatsApp...');
  };

  const shareViaEmail = (invoice: Invoice) => {
    const subject = `Invoice ${invoice.id} - ${invoice.customer}`;
    const body = `Dear ${invoice.customer},\n\nPlease find your invoice details below:\n\nInvoice Number: ${invoice.id}\nAmount: ${invoice.amount}\nDate: ${invoice.date}\nDue Date: ${invoice.dueDate}\n\nThank you for your business!\n\nBest regards,\nErpMax Pakistan`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    showSuccess('Opening email client...');
  };

  const shareViaSMS = (invoice: Invoice) => {
    const message = `Invoice ${invoice.id} for ${invoice.amount}. Due: ${invoice.dueDate}. View: https://erp.example.com/invoice/${invoice.id}`;
    const url = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = url;
    showSuccess('Opening SMS...');
  };

  const copyInvoiceLink = (invoice: Invoice) => {
    const link = `https://erp.example.com/invoice/${invoice.id}`;
    navigator.clipboard.writeText(link);
    showSuccess('Invoice link copied to clipboard!');
  };

  const printInvoice = (invoice: Invoice) => {
    exportSingleInvoicePDF(invoice);
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
            <Card key={stat.title} className="shadow-soft hover:shadow-elevated transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className={`h-3 w-3 ${stat.color}`} />
                  ) : (
                    <TrendingUp className={`h-3 w-3 rotate-90 ${stat.color}`} />
                  )}
                  <span className={stat.color}>{stat.change}</span>
                  <span className="text-muted-foreground hidden sm:inline">this month</span>
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
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Sales (Rs)" />
                    <Bar dataKey="invoices" fill="hsl(142, 76%, 36%)" radius={[8, 8, 0, 0]} name="Invoices" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Top Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSalesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerSalesData.map((entry, index) => (
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

        {/* Invoices Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Recent Invoices</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
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
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={exportToExcel} title="Export to Excel" className="gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span className="hidden sm:inline">Excel</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToPDF} title="Export to PDF" className="gap-2">
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
                    <TableHead className="font-semibold">Invoice ID</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Invoice Date</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.length > 0 ? (
                    paginatedInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold text-primary">{invoice.id}</TableCell>
                        <TableCell className="font-medium">{invoice.customer}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {invoice.items} items
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">{invoice.amount}</TableCell>
                        <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                        <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" title="View Invoice" onClick={() => handleView(invoice)} className="hover:bg-primary/10">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Export Invoice PDF" onClick={() => exportSingleInvoicePDF(invoice)} className="hover:bg-purple-500/10">
                              <FileDown className="h-4 w-4 text-purple-600" />
                            </Button>
                            {invoice.status !== "paid" && (
                              <Button variant="ghost" size="icon" title="Receive Payment" onClick={() => handlePayment(invoice)} className="hover:bg-green-500/10">
                                <DollarSign className="h-4 w-4 text-success" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(invoice)} className="hover:bg-blue-500/10">
                              <Edit className="h-4 w-4 text-primary" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(invoice.id)} className="hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No invoices found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4 space-y-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm text-primary">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                        <span className="inline-flex items-center mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {invoice.items} items
                        </span>
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Invoice Date:</span>
                        <p className="font-medium">{invoice.date}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due Date:</span>
                        <p className="font-medium">{invoice.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Amount</span>
                      <span className="font-bold text-lg">{invoice.amount}</span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(invoice)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportSingleInvoicePDF(invoice)} title="Export PDF">
                        <FileDown className="h-4 w-4 text-purple-600" />
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
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No invoices found. Try adjusting your search or filters.
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredInvoices.length > itemsPerPage && (
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

        {/* Advanced Invoice View Dialog - Zoho/Odoo Style */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">Invoice Preview</DialogTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => selectedInvoice && printInvoice(selectedInvoice)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => selectedInvoice && exportSingleInvoicePDF(selectedInvoice)}>
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6 py-4">
                {/* Professional Invoice Preview */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-lg">
                  {/* Company Header with Logo */}
                  <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-primary">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
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
                      <h3 className="text-4xl font-bold text-gray-800 mb-2">INVOICE</h3>
                      <div className="bg-primary/10 px-4 py-2 rounded-lg inline-block">
                        <p className="text-2xl font-bold text-primary">{selectedInvoice.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details Grid */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Bill To:</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xl font-bold text-gray-800">{selectedInvoice.customer}</p>
                        <p className="text-sm text-gray-600 mt-1">Customer Address</p>
                        <p className="text-sm text-gray-600">City, Country</p>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Invoice Date:</span>
                          <span className="text-sm font-bold">{selectedInvoice.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Due Date:</span>
                          <span className="text-sm font-bold">{selectedInvoice.dueDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-gray-600">Items:</span>
                          <span className="text-sm font-bold">{selectedInvoice.items} items</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-600">Status:</span>
                          {getStatusBadge(selectedInvoice.status)}
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
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Description</th>
                          <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Qty</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Rate</th>
                          <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: selectedInvoice.items }, (_, i) => (
                          <tr key={i} className="border-b border-gray-200">
                            <td className="py-3 px-4 text-sm">{i + 1}</td>
                            <td className="py-3 px-4 text-sm">Product/Service {i + 1}</td>
                            <td className="py-3 px-4 text-sm text-center">1</td>
                            <td className="py-3 px-4 text-sm text-right">Rs {(parseFloat(selectedInvoice.amount.replace(/[^0-9.-]+/g, '')) / selectedInvoice.items).toLocaleString('en-PK', { minimumFractionDigits: 2 })}</td>
                            <td className="py-3 px-4 text-sm text-right font-semibold">Rs {(parseFloat(selectedInvoice.amount.replace(/[^0-9.-]+/g, '')) / selectedInvoice.items).toLocaleString('en-PK', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Section */}
                  <div className="flex justify-end mb-8">
                    <div className="w-80">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">{selectedInvoice.amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax (17%):</span>
                          <span className="font-semibold">Rs {(parseFloat(selectedInvoice.amount.replace(/[^0-9.-]+/g, '')) * 0.17).toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="border-t-2 border-gray-300 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                            <span className="text-2xl font-bold text-primary">{selectedInvoice.amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Payment Information</p>
                    <p className="text-xs text-blue-800">Bank: HBL Bank | Account: 1234567890 | IBAN: PK12HABB1234567890</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">Thank you for your business!</p>
                    <p className="text-xs text-gray-500 mt-1">This is a computer-generated invoice and does not require a signature.</p>
                  </div>
                </div>

                {/* Share Options - Zoho/Odoo Style */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Share Invoice
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-green-50 border-green-200"
                      onClick={() => shareViaWhatsApp(selectedInvoice)}
                    >
                      <MessageSquare className="h-6 w-6 text-green-600 mb-2" />
                      <span className="text-sm font-semibold">WhatsApp</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-blue-50 border-blue-200"
                      onClick={() => shareViaEmail(selectedInvoice)}
                    >
                      <Mail className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="text-sm font-semibold">Email</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-purple-50 border-purple-200"
                      onClick={() => shareViaSMS(selectedInvoice)}
                    >
                      <Send className="h-6 w-6 text-purple-600 mb-2" />
                      <span className="text-sm font-semibold">SMS</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-auto py-4 bg-white hover:bg-gray-50 border-gray-200"
                      onClick={() => copyInvoiceLink(selectedInvoice)}
                    >
                      <Link2 className="h-6 w-6 text-gray-600 mb-2" />
                      <span className="text-sm font-semibold">Copy Link</span>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {selectedInvoice.status !== "paid" && (
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90" size="lg" onClick={() => {
                      setViewOpen(false);
                      handlePayment(selectedInvoice);
                    }}>
                      <DollarSign className="mr-2 h-5 w-5" />
                      Receive Payment
                    </Button>
                  )}
                  {selectedInvoice.status === "paid" && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" size="lg" disabled>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Payment Received
                    </Button>
                  )}
                  <Button variant="outline" size="lg" onClick={() => handleEdit(selectedInvoice)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Invoice
                  </Button>
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
