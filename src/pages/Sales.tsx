import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, FileText } from "lucide-react";
import { SalesStats } from "@/components/sales/SalesStats";
import { SalesChart } from "@/components/sales/SalesChart";
import { SalesTable } from "@/components/sales/SalesTable";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { InvoiceDetails } from "@/components/invoices/InvoiceDetails";
import { InvoiceList } from "@/components/invoices/InvoiceList";
import { Invoice } from "@/types/invoice";

type ViewMode = 'overview' | 'invoices';

export default function Sales() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedInvoice(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedInvoice(null);
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    setSelectedInvoice(null);
  };

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
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              onClick={() => setViewMode('overview')}
            >
              Overview
            </Button>
            <Button
              variant={viewMode === 'invoices' ? 'default' : 'outline'}
              onClick={() => setViewMode('invoices')}
            >
              Invoices
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <InvoiceForm
                  onSuccess={handleCreateSuccess}
                  onCancel={() => setIsCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {viewMode === 'overview' ? (
          <>
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
          </>
        ) : (
          /* Invoice Management View */
          <InvoiceList
            onEdit={handleEditInvoice}
            onView={handleViewInvoice}
          />
        )}

        {/* Invoice Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <InvoiceDetails
                invoice={selectedInvoice}
                onEdit={() => {
                  setIsDetailsOpen(false);
                  setIsEditOpen(true);
                }}
                onClose={handleCloseDetails}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Invoice Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Invoice</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <InvoiceForm
                invoice={selectedInvoice}
                onSuccess={handleEditSuccess}
                onCancel={handleCloseEdit}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
