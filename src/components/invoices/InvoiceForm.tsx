import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Calculator } from "lucide-react";
import { useSupabaseQuery, useSupabaseMutation } from "@/hooks/useSupabaseQuery";
import { showSuccess, showError } from "@/lib/toast";
import { Invoice, Customer, InvoiceFormData, InvoiceItemFormData } from "@/types/invoice";

const invoiceItemSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit_price: z.number().min(0, "Unit price cannot be negative"),
  tax_rate: z.number().min(0).max(100, "Tax rate must be between 0-100"),
});

const invoiceSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  invoice_number: z.string().min(1, "Invoice number is required"),
  status: z.enum(['draft', 'pending', 'paid', 'overdue', 'cancelled']),
  issue_date: z.string().min(1, "Issue date is required"),
  due_date: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
}).refine((data) => {
  const issueDate = new Date(data.issue_date);
  const dueDate = new Date(data.due_date);
  return dueDate >= issueDate;
}, {
  message: "Due date must be on or after issue date",
  path: ["due_date"],
});

interface InvoiceFormProps {
  invoice?: Invoice;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InvoiceForm({ invoice, onSuccess, onCancel }: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch customers
  const { data: customers = [], isLoading: customersLoading } = useSupabaseQuery<Customer>('customers', {
    select: 'id, name, email',
    orderBy: { column: 'name', ascending: true }
  });

  // Mutations
  const createInvoice = useSupabaseMutation('invoices', 'insert');
  const updateInvoice = useSupabaseMutation('invoices', 'update');
  const createItem = useSupabaseMutation('invoice_items', 'insert');
  const deleteItem = useSupabaseMutation('invoice_items', 'delete');

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customer_id: invoice?.customer_id || "",
      invoice_number: invoice?.invoice_number || "",
      status: invoice?.status || 'draft',
      issue_date: invoice?.issue_date || new Date().toISOString().split('T')[0],
      due_date: invoice?.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: invoice?.notes || "",
      items: invoice?.items?.map(item => ({
        product_name: item.product_name,
        description: item.description || "",
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
      })) || [{
        product_name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        tax_rate: 17, // Default PK tax rate
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const subtotal = watchedItems?.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) || 0;
  const taxTotal = watchedItems?.reduce((sum, item) => sum + ((item.quantity * item.unit_price) * item.tax_rate / 100), 0) || 0;
  const total = subtotal + taxTotal;

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    try {
      const invoiceData = {
        customer_id: data.customer_id,
        invoice_number: data.invoice_number,
        status: data.status,
        issue_date: data.issue_date,
        due_date: data.due_date,
        notes: data.notes,
        subtotal,
        tax_total: taxTotal,
        discount_total: 0,
        total_amount: total,
      };

      let invoiceId = invoice?.id;

      if (invoice) {
        // Update existing invoice
        await updateInvoice.mutateAsync({ ...invoiceData, id: invoice.id });
      } else {
        // Create new invoice
        const result = await createInvoice.mutateAsync(invoiceData);
        invoiceId = result.id;
      }

      // Handle items
      if (invoiceId) {
        // Delete existing items if updating
        if (invoice?.items) {
          await Promise.all(
            invoice.items.map(item => deleteItem.mutateAsync({ id: item.id }))
          );
        }

        // Create new items
        await Promise.all(
          data.items.map(item => createItem.mutateAsync({
            invoice_id: invoiceId,
            product_name: item.product_name,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_rate: item.tax_rate,
            line_total: item.quantity * item.unit_price * (1 + item.tax_rate / 100),
          }))
        );
      }

      showSuccess(`Invoice ${invoice ? 'updated' : 'created'} successfully!`);
      onSuccess();
    } catch (error) {
      console.error('Invoice save error:', error);
      showError(`Failed to ${invoice ? 'update' : 'create'} invoice`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer *</Label>
              <Select
                value={form.watch("customer_id")}
                onValueChange={(value) => form.setValue("customer_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} {customer.email && `(${customer.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.customer_id && (
                <p className="text-sm text-destructive">{form.formState.errors.customer_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_number">Invoice Number *</Label>
              <Input
                id="invoice_number"
                {...form.register("invoice_number")}
                placeholder="INV-0001"
              />
              {form.formState.errors.invoice_number && (
                <p className="text-sm text-destructive">{form.formState.errors.invoice_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value: Invoice['status']) => form.setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date *</Label>
              <Input
                id="issue_date"
                type="date"
                {...form.register("issue_date")}
              />
              {form.formState.errors.issue_date && (
                <p className="text-sm text-destructive">{form.formState.errors.issue_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                {...form.register("due_date")}
              />
              {form.formState.errors.due_date && (
                <p className="text-sm text-destructive">{form.formState.errors.due_date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                product_name: "",
                description: "",
                quantity: 1,
                unit_price: 0,
                tax_rate: 17,
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Product *</Label>
                  <Input
                    {...form.register(`items.${index}.product_name`)}
                    placeholder="Product name"
                  />
                  {form.formState.errors.items?.[index]?.product_name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.items[index]?.product_name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    {...form.register(`items.${index}.description`)}
                    placeholder="Description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Qty *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                    placeholder="1"
                  />
                  {form.formState.errors.items?.[index]?.quantity && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Unit Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register(`items.${index}.unit_price`, { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.items?.[index]?.unit_price && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.items[index]?.unit_price?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register(`items.${index}.tax_rate`, { valueAsNumber: true })}
                    placeholder="17"
                  />
                  {form.formState.errors.items?.[index]?.tax_rate && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.items[index]?.tax_rate?.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="space-y-2">
                    <Label>Line Total</Label>
                    <div className="text-sm font-medium">
                      Rs {(watchedItems?.[index]?.quantity * watchedItems?.[index]?.unit_price * (1 + watchedItems?.[index]?.tax_rate / 100) || 0).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>Rs {taxTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : invoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
