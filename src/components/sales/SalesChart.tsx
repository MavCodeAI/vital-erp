import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { TrendingUp } from "lucide-react";

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export function SalesChart() {
  // Using real invoice data from Supabase
  const { data: invoices = [], isLoading } = useSupabaseQuery('invoices', {
    select: 'total_amount, created_at',
    orderBy: { column: 'created_at', ascending: true }
  });

  const processChartData = (): SalesData[] => {
    if (!invoices || invoices.length === 0) return [];

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const dayInvoices = invoices.filter((invoice: { created_at?: string }) => 
        invoice.created_at && invoice.created_at.startsWith(date)
      );
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        revenue: dayInvoices.reduce((sum: number, invoice: { total_amount?: number }) => sum + (invoice.total_amount || 0), 0),
        orders: dayInvoices.length
      };
    });
  };

  const chartData = processChartData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Sales Overview (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                className="text-xs"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Revenue (Rs)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(142, 76%, 36%)" 
                strokeWidth={2}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
