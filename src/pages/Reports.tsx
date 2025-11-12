import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileBarChart, TrendingUp, DollarSign, Users, Package, ShoppingCart, FileText, Download, Calendar, BarChart3, PieChart, FileSpreadsheet, Printer, Eye } from "lucide-react";
import { showSuccess } from "@/lib/toast";

const reportCategories = [
  {
    title: "Financial Reports",
    description: "Revenue, expenses, profit & loss statements",
    icon: DollarSign,
    reports: [
      { name: "Profit & Loss Statement", lastGenerated: "2024-01-15" },
      { name: "Balance Sheet", lastGenerated: "2024-01-15" },
      { name: "Cash Flow Statement", lastGenerated: "2024-01-14" },
      { name: "Tax Summary", lastGenerated: "2024-01-10" },
    ],
  },
  {
    title: "Sales Reports",
    description: "Sales performance, invoices, and revenue trends",
    icon: TrendingUp,
    reports: [
      { name: "Sales by Customer", lastGenerated: "2024-01-15" },
      { name: "Sales by Product", lastGenerated: "2024-01-15" },
      { name: "Invoice Aging Report", lastGenerated: "2024-01-14" },
      { name: "Sales Forecast", lastGenerated: "2024-01-12" },
    ],
  },
  {
    title: "Inventory Reports",
    description: "Stock levels, movements, and valuations",
    icon: Package,
    reports: [
      { name: "Stock Summary", lastGenerated: "2024-01-15" },
      { name: "Low Stock Alert", lastGenerated: "2024-01-15" },
      { name: "Inventory Valuation", lastGenerated: "2024-01-14" },
      { name: "Stock Movement", lastGenerated: "2024-01-13" },
    ],
  },
  {
    title: "Purchase Reports",
    description: "Purchase orders, vendor analysis, and spending",
    icon: ShoppingCart,
    reports: [
      { name: "Purchase by Vendor", lastGenerated: "2024-01-15" },
      { name: "Purchase Order Status", lastGenerated: "2024-01-14" },
      { name: "Vendor Performance", lastGenerated: "2024-01-13" },
      { name: "Spending Analysis", lastGenerated: "2024-01-12" },
    ],
  },
  {
    title: "HR Reports",
    description: "Employee data, attendance, and payroll",
    icon: Users,
    reports: [
      { name: "Employee Directory", lastGenerated: "2024-01-15" },
      { name: "Attendance Summary", lastGenerated: "2024-01-15" },
      { name: "Payroll Report", lastGenerated: "2024-01-14" },
      { name: "Leave Balance", lastGenerated: "2024-01-13" },
    ],
  },
  {
    title: "Custom Reports",
    description: "Build and save your own custom reports",
    icon: FileText,
    reports: [
      { name: "Quarterly Performance", lastGenerated: "2024-01-10" },
      { name: "Department Budget", lastGenerated: "2024-01-08" },
      { name: "Project Profitability", lastGenerated: "2024-01-05" },
    ],
  },
];

const quickStats = [
  { title: "Reports Generated", value: "1,234", icon: FileBarChart, color: "text-primary", bgColor: "bg-blue-500/10" },
  { title: "This Month", value: "89", icon: Calendar, color: "text-success", bgColor: "bg-green-500/10" },
  { title: "Scheduled", value: "12", icon: BarChart3, color: "text-warning", bgColor: "bg-yellow-500/10" },
  { title: "Custom Reports", value: "24", icon: PieChart, color: "text-primary", bgColor: "bg-purple-500/10" },
];

export default function Reports() {
  const handleDownload = (reportName: string) => {
    showSuccess(`Downloading ${reportName}...`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Generate comprehensive business reports and analytics
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <FileBarChart className="mr-2 h-4 w-4" />
            Create Custom Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <Card key={stat.title} className="shadow-soft hover:shadow-elevated transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl xl:text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Categories */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reportCategories.map((category) => (
            <Card key={category.title} className="shadow-soft hover:shadow-elevated transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.reports.map((report) => (
                    <div
                      key={report.name}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">{report.name}</p>
                        <p className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Download PDF" onClick={() => handleDownload(report.name)}>
                          <Download className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Export Excel">
                          <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Print">
                          <Printer className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
