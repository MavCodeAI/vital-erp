import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  Target,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  FileText,
  Activity,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

// Type definitions for database entities
interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  avatar_url: string | null;
  tenant_id: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  is_active: boolean;
  settings: Record<string, unknown>;
}

const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "Jun", revenue: 67000, expenses: 40000, profit: 27000 },
  { month: "Jul", revenue: 72000, expenses: 42000, profit: 30000 },
];

const salesData = [
  { category: "Electronics", sales: 45000 },
  { category: "Furniture", sales: 32000 },
  { category: "Accessories", sales: 28000 },
  { category: "Software", sales: 38000 },
  { category: "Services", sales: 42000 },
];

const orderStatusData = [
  { name: "Completed", value: 145, color: "hsl(142, 76%, 36%)" },
  { name: "Pending", value: 58, color: "hsl(48, 96%, 53%)" },
  { name: "Processing", value: 32, color: "hsl(221, 83%, 53%)" },
  { name: "Cancelled", value: 12, color: "hsl(0, 84%, 60%)" },
];

const weeklyData = [
  { day: "Mon", orders: 45, revenue: 12500 },
  { day: "Tue", orders: 52, revenue: 15200 },
  { day: "Wed", orders: 48, revenue: 13800 },
  { day: "Thu", orders: 61, revenue: 18400 },
  { day: "Fri", orders: 55, revenue: 16700 },
  { day: "Sat", orders: 38, revenue: 11200 },
  { day: "Sun", orders: 28, revenue: 8900 },
];

const kpis = [
  {
    title: "Total Revenue",
    value: "Rs 12,456,200",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-success",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Profit Margin",
    value: "23.8%",
    change: "+2.3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-success",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Inventory Value",
    value: "Rs 8,923,400",
    change: "+5.7%",
    trend: "up",
    icon: Package,
    color: "text-success",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Active Customers",
    value: "2,847",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "text-success",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Pending Invoices",
    value: "Rs 456,800",
    change: "-12.1%",
    trend: "down",
    icon: FileText,
    color: "text-destructive",
    bgColor: "bg-red-500/10",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: profiles, isLoading: profilesLoading } = useSupabaseQuery<Profile>('profiles', {
    select: 'id, full_name, email, created_at',
    limit: 10
  });

  const { data: tenants, isLoading: tenantsLoading } = useSupabaseQuery<Tenant>('tenants', {
    select: 'id, name, is_active, created_at',
    filter: { is_active: true }
  });
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Dashboard
            </h1>
            <p className="text-base text-muted-foreground mt-2">
              Welcome back, {user?.user_metadata?.full_name || 'User'}! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-lg font-bold text-primary">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi, index) => (
            <Card 
              key={kpi.title} 
              className="relative overflow-hidden border-2 hover:border-primary/50 shadow-soft hover:shadow-floating transition-all duration-500 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${kpi.bgColor} group-hover:scale-110 transition-transform shadow-lg`}>
                  <kpi.icon className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl xl:text-3xl font-black mb-2">{kpi.value}</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${kpi.trend === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className={`h-4 w-4 ${kpi.color}`} />
                    ) : (
                      <ArrowDownRight className={`h-4 w-4 ${kpi.color}`} />
                    )}
                    <span className={`font-bold ${kpi.color}`}>{kpi.change}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="shadow-elevated border-2 hover:border-primary/30 transition-all lg:col-span-2">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                Revenue & Profit Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                    <Area type="monotone" dataKey="profit" stroke="hsl(142, 76%, 36%)" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts Row */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(142, 76%, 36%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="category" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profilesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : profiles && profiles.length > 0 ? (
                  profiles.map((profile, i) => (
                    <div key={profile.id} className="flex items-start gap-3 sm:gap-4 pb-4 border-b last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 flex-shrink-0">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{profile.full_name || 'Unknown User'}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{profile.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(profile.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Active Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : tenants && tenants.length > 0 ? (
                  tenants.slice(0, 5).map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{tenant.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(tenant.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No active tenants</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
