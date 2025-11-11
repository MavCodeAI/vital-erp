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
import { Plus, Users, UserCheck, Building2, Mail, Eye, Edit, Trash2 } from "lucide-react";

const stats = [
  { title: "Total Parties", value: "487", icon: Users, color: "text-primary" },
  { title: "Customers", value: "342", icon: UserCheck, color: "text-success" },
  { title: "Vendors", value: "145", icon: Building2, color: "text-primary" },
  { title: "Active Contacts", value: "423", icon: Mail, color: "text-success" },
];

const initialParties = [
  { id: "PTY-001", name: "Karachi Corporation", type: "customer", email: "contact@karachicorp.pk", phone: "+92 21 3456 7890", balance: "Rs 1,250,000" },
  { id: "PTY-002", name: "Lahore Tech Solutions", type: "customer", email: "info@lahoretech.pk", phone: "+92 42 3567 8901", balance: "Rs 820,000" },
  { id: "PTY-003", name: "Islamabad Suppliers", type: "vendor", email: "sales@isb-suppliers.pk", phone: "+92 51 2345 6789", balance: "Rs -540,000" },
  { id: "PTY-004", name: "Pakistan Industries", type: "customer", email: "contact@pakindustries.pk", phone: "+92 21 4567 8901", balance: "Rs 1,580,000" },
  { id: "PTY-005", name: "Faisalabad Wholesale", type: "vendor", email: "orders@fsd-wholesale.pk", phone: "+92 41 2678 9012", balance: "Rs -320,000" },
];

interface Party {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  balance: string;
}

export default function Parties() {
  const [open, setOpen] = useState(false);
  const [parties, setParties] = useState(initialParties);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleCreate = () => {
    if (!name || !type || !email) {
      showError("Please fill all required fields");
      return;
    }

    if (editingId) {
      setParties(parties.map(party => 
        party.id === editingId 
          ? { ...party, name, type, email, phone }
          : party
      ));
      showSuccess("Party updated successfully!");
    } else {
      const newParty = {
        id: `PTY-${Date.now().toString().slice(-6)}`,
        name,
        type,
        email,
        phone,
        balance: "Rs 0"
      };
      setParties([newParty, ...parties]);
      showSuccess("Party added successfully!");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (party: Party) => {
    setEditingId(party.id);
    setName(party.name);
    setType(party.type);
    setEmail(party.email);
    setPhone(party.phone);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this party?")) {
      setParties(parties.filter(party => party.id !== id));
      showSuccess("Party deleted successfully!");
    }
  };

  const resetForm = () => {
    setName("");
    setType("");
    setEmail("");
    setPhone("");
    setEditingId(null);
  };

  const getTypeBadge = (type: string) => {
    return type === "customer" ? (
      <Badge variant="default">Customer</Badge>
    ) : (
      <Badge variant="secondary">Vendor</Badge>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Parties</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage customers, vendors, and contacts
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Party
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Party" : "Add New Party"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="party-name">Party Name *</Label>
                    <Input id="party-name" placeholder="Enter party name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="party-type">Type *</Label>
                    <select
                      id="party-type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="party-email">Email *</Label>
                    <Input id="party-email" type="email" placeholder="contact@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="party-phone">Phone</Label>
                    <Input id="party-phone" placeholder="+92 300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Street address" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="State" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="ZIP" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
                  <Button className="bg-gradient-primary" onClick={handleCreate}>
                    {editingId ? "Update Party" : "Add Party"}
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

        {/* Parties Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>All Parties</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Party ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parties.map((party) => (
                    <TableRow key={party.id}>
                      <TableCell className="font-medium">{party.id}</TableCell>
                      <TableCell>{party.name}</TableCell>
                      <TableCell>{getTypeBadge(party.type)}</TableCell>
                      <TableCell>{party.email}</TableCell>
                      <TableCell>{party.phone}</TableCell>
                      <TableCell>{party.balance}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(party)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(party.id)}>
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
              {parties.map((party) => (
                <div key={party.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{party.id}</p>
                      <p className="text-base font-medium">{party.name}</p>
                    </div>
                    {getTypeBadge(party.type)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{party.email}</p>
                    <p className="text-muted-foreground">{party.phone}</p>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Balance:</span>
                      <span className="font-bold text-lg">{party.balance}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(party)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(party.id)}>
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
