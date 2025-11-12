import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download
} from "lucide-react";
import { useSupabaseQuery, useSupabaseMutation } from "@/hooks/useSupabaseQuery";

interface Sale {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  due_date: string;
  items_count: number;
}

// Mock data for now - replace with actual Supabase data when tables exist
const mockSales: Sale[] = [
  {
    id: "1",
    invoice_number: "INV-1001",
    customer_name: "Karachi Traders",
    customer_email: "info@karachitraders.pk",
    total_amount: 125000,
    status: "completed",
    created_at: "2024-01-15",
    due_date: "2024-02-15",
    items_count: 5
  },
  {
    id: "2", 
    invoice_number: "INV-1002",
    customer_name: "Lahore Tech Solutions",
    customer_email: "contact@lahoretech.com",
    total_amount: 85000,
    status: "pending",
    created_at: "2024-01-14",
    due_date: "2024-02-14",
    items_count: 3
  }
];

export function SalesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Using mock data for now - replace with actual Supabase query when sales table exists
  const { data: sales = mockSales, isLoading, error } = useSupabaseQuery<Sale>('sales', {
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });

  const deleteSale = useSupabaseMutation('sales', 'delete');

  const filteredSales = sales?.filter(sale => {
    const matchesSearch = sale.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Pending" },
      completed: { variant: "default" as const, label: "Completed" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" }
    };
    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDelete = async (sale: Sale) => {
    if (confirm(`Are you sure you want to delete sale ${sale.invoice_number}?`)) {
      try {
        await deleteSale.mutateAsync({ id: sale.id });
      } catch (error) {
        console.error('Failed to delete sale:', error);
      }
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading sales data</p>
            <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sales Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all" ? "All Status" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sales orders found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.invoice_number}</TableCell>
                    <TableCell>{sale.customer_name}</TableCell>
                    <TableCell className="text-muted-foreground">{sale.customer_email}</TableCell>
                    <TableCell>Rs {sale.total_amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell>{new Date(sale.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.items_count}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(sale)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
