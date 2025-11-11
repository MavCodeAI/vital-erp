import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, ShoppingCart, Package, Users, FileText, AlertCircle, CheckCircle2, Clock, Activity } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

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
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="shadow-soft hover:shadow-elevated transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl xl:text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className={`h-3 w-3 ${kpi.color}`} />
                  ) : (
                    <ArrowDownRight className={`h-3 w-3 ${kpi.color}`} />
                  )}
                  <span className={kpi.color}>{kpi.change}</span>
                  <span className="text-muted-foreground hidden lg:inline">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
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
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: ShoppingCart, title: "New order received", desc: "Order #INV-1001 from Acme Corp", time: "2h ago", color: "bg-blue-500/10 text-blue-600" },
                  { icon: CheckCircle2, title: "Payment confirmed", desc: "Invoice #INV-998 - Rs 45,000", time: "3h ago", color: "bg-green-500/10 text-green-600" },
                  { icon: Package, title: "Stock alert", desc: "Low inventory for Product XYZ", time: "5h ago", color: "bg-orange-500/10 text-orange-600" },
                  { icon: Users, title: "New customer registered", desc: "Tech Solutions Pvt Ltd", time: "6h ago", color: "bg-purple-500/10 text-purple-600" },
                  { icon: AlertCircle, title: "Pending approval", desc: "Purchase order #PO-445", time: "8h ago", color: "bg-red-500/10 text-red-600" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4 pb-4 border-b last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full ${activity.color} flex-shrink-0`}>
                      <activity.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{activity.desc}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Orders Today</span>
                    <span className="font-bold">47</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revenue Today</span>
                    <span className="font-bold">Rs 125K</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '65%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target Progress</span>
                    <span className="font-bold">82%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '82%' }} />
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <span className="text-sm font-bold">145</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-sm font-bold">58</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Urgent</span>
                    </div>
                    <span className="text-sm font-bold">12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
