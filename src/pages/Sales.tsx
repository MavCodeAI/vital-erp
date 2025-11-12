import { useState } from "react";
import { showSuccess, showError } from "@/lib/toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, PlusCircle } from "lucide-react";
import { SalesStats } from "@/components/sales/SalesStats";
import { SalesChart } from "@/components/sales/SalesChart";
import { SalesTable } from "@/components/sales/SalesTable";

export default function Sales() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
            <p className="text-muted-foreground">
              Manage sales orders, invoices, and track revenue
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Sale</DialogTitle>
                </DialogHeader>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sale creation form will be implemented here</p>
                  <p className="text-sm">This will integrate with your Supabase database</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <SalesStats />

        {/* Charts */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <SalesChart />
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
                <Button variant="outline" className="justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Table */}
        <SalesTable />
      </div>
    </MainLayout>
  );
}
