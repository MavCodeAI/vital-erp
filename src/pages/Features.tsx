import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Calendar,
  Briefcase,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
            <span className="text-xl font-bold">ErpMax</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-sm font-medium text-primary">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Modern Business
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your business efficiently in one comprehensive platform
          </p>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Core Business Modules</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreModules.map((module, index) => (
              <Card key={index} className="hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center mb-4">
                    <module.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <ul className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to experience these features?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your free trial today and see how ErpMax can transform your business
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-primary">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 ErpMax. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const coreModules = [
  {
    icon: ShoppingCart,
    title: "Sales Management",
    description: "Complete sales workflow from quotation to invoice",
    features: [
      "Quotation & Invoice Generation",
      "Customer Management",
      "Payment Tracking",
      "Sales Analytics"
    ]
  },
  {
    icon: Package,
    title: "Inventory Control",
    description: "Real-time inventory tracking and management",
    features: [
      "Stock Management",
      "Barcode Scanning",
      "Multi-warehouse Support",
      "Automatic Reorder Points"
    ]
  },
  {
    icon: FileText,
    title: "Purchase Management",
    description: "Streamline your procurement process",
    features: [
      "Purchase Orders",
      "Vendor Management",
      "Three-way Matching",
      "Approval Workflows"
    ]
  },
  {
    icon: DollarSign,
    title: "Accounting",
    description: "Complete financial management solution",
    features: [
      "General Ledger",
      "Accounts Payable/Receivable",
      "Financial Reports",
      "Tax Management"
    ]
  },
  {
    icon: Users,
    title: "CRM",
    description: "Build stronger customer relationships",
    features: [
      "Lead Management",
      "Contact Database",
      "Sales Pipeline",
      "Activity Tracking"
    ]
  },
  {
    icon: Briefcase,
    title: "HR Management",
    description: "Manage your workforce effectively",
    features: [
      "Employee Records",
      "Attendance Tracking",
      "Leave Management",
      "Payroll Processing"
    ]
  },
  {
    icon: Calendar,
    title: "Project Management",
    description: "Track and manage projects efficiently",
    features: [
      "Task Management",
      "Time Tracking",
      "Resource Allocation",
      "Progress Monitoring"
    ]
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Data-driven insights for better decisions",
    features: [
      "Custom Reports",
      "Real-time Dashboards",
      "Export Options",
      "Scheduled Reports"
    ]
  },
  {
    icon: TrendingUp,
    title: "Business Intelligence",
    description: "Advanced analytics and forecasting",
    features: [
      "Sales Forecasting",
      "Trend Analysis",
      "KPI Tracking",
      "Performance Metrics"
    ]
  }
];

const advancedFeatures = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with role-based access control, data encryption, and audit logs"
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Instant data synchronization across all devices and locations"
  },
  {
    icon: CheckCircle2,
    title: "Automated Workflows",
    description: "Save time with intelligent automation and smart notifications"
  },
  {
    icon: TrendingUp,
    title: "Scalable Architecture",
    description: "Grows with your business from startup to enterprise"
  }
];
