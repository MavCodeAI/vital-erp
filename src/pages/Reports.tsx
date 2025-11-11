import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileBarChart, TrendingUp, DollarSign, Users, Package, ShoppingCart, FileText, Download } from "lucide-react";

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

export default function Reports() {
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
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">Last: {report.lastGenerated}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
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
