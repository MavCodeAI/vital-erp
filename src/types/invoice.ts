// Invoice types and interfaces
export interface Customer {
  id: string;
  tenant_id: string;
  name: string;
  email?: string;
  phone?: string;
  billing_address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  tenant_id: string;
  invoice_id: string;
  product_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  created_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  customer_id: string;
  customer?: Customer;
  invoice_number: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  notes?: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  total_amount: number;
  created_by?: string;
  items?: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceFormData {
  customer_id: string;
  invoice_number: string;
  status: Invoice['status'];
  issue_date: string;
  due_date: string;
  notes?: string;
  items: Omit<InvoiceItem, 'id' | 'tenant_id' | 'invoice_id' | 'created_at'>[];
}

export interface InvoiceItemFormData {
  product_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}
