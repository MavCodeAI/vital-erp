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
import { Plus, Wallet, TrendingUp, TrendingDown, DollarSign, Eye, Edit, Trash2 } from "lucide-react";

const stats = [
  { title: "Total Assets", value: "Rs 24,589,000", icon: Wallet, color: "text-success" },
  { title: "Revenue", value: "Rs 12,456,200", icon: TrendingUp, color: "text-success" },
  { title: "Expenses", value: "Rs 4,523,000", icon: TrendingDown, color: "text-destructive" },
  { title: "Net Profit", value: "Rs 7,933,200", icon: DollarSign, color: "text-success" },
];

const initialTransactions = [
  { id: "TXN-001", date: "2024-01-15", account: "Cash", type: "credit", amount: "Rs 500,000", description: "Sales payment" },
  { id: "TXN-002", date: "2024-01-14", account: "Expenses", type: "debit", amount: "Rs 120,000", description: "Office supplies" },
  { id: "TXN-003", date: "2024-01-13", account: "Revenue", type: "credit", amount: "Rs 850,000", description: "Service income" },
  { id: "TXN-004", date: "2024-01-12", account: "Payroll", type: "debit", amount: "Rs 1,500,000", description: "Monthly salaries" },
  { id: "TXN-005", date: "2024-01-11", account: "Assets", type: "debit", amount: "Rs 2,500,000", description: "Equipment purchase" },
];

interface Transaction {
  id: string;
  date: string;
  account: string;
  type: string;
  amount: string;
  description: string;
}

export default function Accounting() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [account, setAccount] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCreate = () => {
    if (!account || !type || !amount) {
      showError("Please fill all required fields");
      return;
    }

    if (editingId) {
      setTransactions(transactions.map(txn => 
        txn.id === editingId 
          ? { ...txn, account, type, amount: `Rs ${parseFloat(amount).toLocaleString('en-PK')}`, description, date }
          : txn
      ));
      showSuccess("Transaction updated successfully!");
    } else {
      const newTransaction = {
        id: `TXN-${Date.now().toString().slice(-6)}`,
        date,
        account,
        type,
        amount: `Rs ${parseFloat(amount).toLocaleString('en-PK')}`,
        description
      };
      setTransactions([newTransaction, ...transactions]);
      showSuccess("Transaction added successfully!");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (txn: Transaction) => {
    setEditingId(txn.id);
    setAccount(txn.account);
    setType(txn.type);
    setAmount(txn.amount.replace(/[^0-9.-]+/g, ""));
    setDescription(txn.description);
    setDate(txn.date);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter(txn => txn.id !== id));
      showSuccess("Transaction deleted successfully!");
    }
  };

  const resetForm = () => {
    setAccount("");
    setType("");
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
  };

  const getTypeBadge = (type: string) => {
    return type === "credit" ? (
      <Badge variant="default">Credit</Badge>
    ) : (
      <Badge variant="secondary">Debit</Badge>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Accounting</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage accounts, journal entries, and financial statements
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Transaction" : "New Journal Entry"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="txn-date">Date *</Label>
                    <Input id="txn-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account">Account *</Label>
                    <select
                      id="account"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select account</option>
                      <option value="Cash">Cash</option>
                      <option value="Revenue">Revenue</option>
                      <option value="Expenses">Expenses</option>
                      <option value="Assets">Assets</option>
                      <option value="Payroll">Payroll</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="txn-amount">Amount (Rs) *</Label>
                    <Input id="txn-amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input id="description" placeholder="Transaction description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <Button className="bg-gradient-primary" onClick={handleCreate}>
                    {editingId ? "Update Entry" : "Add Entry"}
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

        {/* Transactions Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">{txn.id}</TableCell>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell>{txn.account}</TableCell>
                      <TableCell>{getTypeBadge(txn.type)}</TableCell>
                      <TableCell>{txn.amount}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(txn)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(txn.id)}>
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
              {transactions.map((txn) => (
                <div key={txn.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{txn.id}</p>
                      <p className="text-xs text-muted-foreground">{txn.date}</p>
                    </div>
                    {getTypeBadge(txn.type)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Account:</span>
                      <span className="font-medium">{txn.account}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-bold text-lg">{txn.amount}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{txn.description}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(txn)}>
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(txn.id)}>
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
