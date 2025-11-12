import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target } from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
}

export function SalesStats() {
  // Fetch real invoice data with customer information
  const { data: invoices = [], isLoading } = useSupabaseQuery('invoices', {
    select: `
      *,
      customer:customers(name, email)
    `,
    orderBy: { column: 'created_at', ascending: false }
  });

  // Fetch customer count for conversion rate calculation
  const { data: customers = [] } = useSupabaseQuery('customers', {
    select: 'id, created_at'
  });

  const stats: SalesStats = {
    totalRevenue: invoices?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0,
    totalOrders: invoices?.length || 0,
    averageOrderValue: invoices?.length ? invoices.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) / invoices.length : 0,
    conversionRate: customers?.length ? ((invoices?.length || 0) / customers.length) * 100 : 0,
    revenueChange: 12.5, // TODO: Calculate actual change from previous period
    ordersChange: 8.2    // TODO: Calculate actual change from previous period
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `Rs ${stats.totalRevenue.toLocaleString()}`,
      change: `+${stats.revenueChange}%`,
      trend: "up" as const,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `+${stats.ordersChange}%`,
      trend: "up" as const,
      icon: ShoppingCart,
      color: "text-success",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Avg Order Value",
      value: `Rs ${Math.round(stats.averageOrderValue).toLocaleString()}`,
      change: "+5.3%",
      trend: "up" as const,
      icon: Target,
      color: "text-success",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: "-2.1%",
      trend: "down" as const,
      icon: Users,
      color: "text-destructive",
      bgColor: "bg-orange-500/10"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card 
          key={stat.title} 
          className="relative overflow-hidden border-2 hover:border-primary/50 shadow-soft hover:shadow-floating transition-all duration-500 hover:-translate-y-1 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform shadow-lg`}>
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl xl:text-3xl font-black mb-2">{stat.value}</div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {stat.trend === "up" ? (
                  <TrendingUp className={`h-4 w-4 ${stat.color}`} />
                ) : (
                  <TrendingDown className={`h-4 w-4 ${stat.color}`} />
                )}
                <span className={`font-bold ${stat.color}`}>{stat.change}</span>
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
