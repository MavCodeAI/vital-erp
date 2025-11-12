import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Mail, Phone } from "lucide-react";
import { Invoice } from "@/types/invoice";

interface InvoiceDetailsProps {
  invoice: Invoice;
  onEdit?: () => void;
  onClose?: () => void;
}

export function InvoiceDetails({ invoice, onEdit, onClose }: InvoiceDetailsProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: "secondary" as const, label: "Draft" },
      pending: { variant: "default" as const, label: "Pending" },
      paid: { variant: "default" as const, label: "Paid", className: "bg-green-500 hover:bg-green-600" },
      overdue: { variant: "destructive" as const, label: "Overdue" },
      cancelled: { variant: "outline" as const, label: "Cancelled" }
    };
    const config = variants[status as keyof typeof variants] || variants.draft;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    alert("PDF download feature coming soon!");
  };

  const handleSendEmail = () => {
    // TODO: Implement email sending
    alert("Email sending feature coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice {invoice.invoice_number}</h2>
          <p className="text-muted-foreground">Created on {new Date(invoice.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(invoice.status)}
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              Edit Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Invoice Number</label>
                  <p className="text-lg font-semibold">{invoice.invoice_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(invoice.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                  <p>{new Date(invoice.issue_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                  <p>{new Date(invoice.due_date).toLocaleDateString()}</p>
                </div>
              </div>
              {invoice.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="mt-1">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.items?.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Qty: {item.quantity}</span>
                        <span>Unit Price: Rs {item.unit_price.toLocaleString()}</span>
                        <span>Tax: {item.tax_rate}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Rs {item.line_total.toLocaleString()}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">No items found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer & Totals */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold">{invoice.customer?.name || 'Unknown Customer'}</h4>
                {invoice.customer?.email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {invoice.customer.email}
                  </p>
                )}
                {invoice.customer?.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {invoice.customer.phone}
                  </p>
                )}
              </div>
              {invoice.customer?.billing_address && (
                <div className="text-sm">
                  <p className="font-medium">Billing Address</p>
                  <p className="text-muted-foreground">
                    {invoice.customer.billing_address.street && `${invoice.customer.billing_address.street}, `}
                    {invoice.customer.billing_address.city && `${invoice.customer.billing_address.city}, `}
                    {invoice.customer.billing_address.country}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rs {invoice.tax_total.toLocaleString()}</span>
              </div>
              {invoice.discount_total > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-Rs {invoice.discount_total.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>Rs {invoice.total_amount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
