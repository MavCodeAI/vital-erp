import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Warehouse, 
  Calculator, 
  Users, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const features = [
  {
    icon: LayoutDashboard,
    title: "Real-time Dashboard",
    description: "Monitor KPIs, revenue, and business metrics at a glance",
  },
  {
    icon: ShoppingCart,
    title: "Sales Management",
    description: "Complete invoice lifecycle from quotes to payments",
  },
  {
    icon: Package,
    title: "Purchase Orders",
    description: "Streamlined procurement with approval workflows",
  },
  {
    icon: Warehouse,
    title: "Inventory Control",
    description: "Multi-warehouse management with real-time tracking",
  },
  {
    icon: Calculator,
    title: "Full Accounting",
    description: "Double-entry bookkeeping with financial statements",
  },
  {
    icon: Users,
    title: "HR & Payroll",
    description: "Employee management, attendance, and payroll processing",
  },
];

const benefits = [
  "Multi-tenant SaaS architecture",
  "Role-based access control",
  "Real-time updates",
  "Mobile responsive",
  "Comprehensive security",
  "Advanced reporting",
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Production-Ready ERP System
                </span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight lg:text-6xl">
                  Enterprise Resource Planning
                  <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                    Made Simple
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl">
                  Complete business management solution with 11 integrated modules. 
                  Manage sales, inventory, accounting, HR, and more from a single platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="h-12 px-8 bg-gradient-primary hover:opacity-90"
                  onClick={() => navigate("/dashboard")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-12 px-8"
                >
                  View Demo
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4">
                {benefits.slice(0, 3).map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-3xl" />
              <img 
                src={heroImage}
                alt="ErpMax Dashboard"
                className="relative rounded-2xl shadow-elevated border border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Everything You Need to Run Your Business
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            11 comprehensive modules working together seamlessly to give you complete control
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="shadow-soft hover:shadow-elevated transition-all cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-gradient-primary transition-all">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="shadow-elevated bg-gradient-primary text-white border-0">
          <CardContent className="p-6 sm:p-8 md:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of businesses managing their operations efficiently with ErpMax
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="h-12 px-8"
              onClick={() => navigate("/dashboard")}
            >
              Start Using ErpMax
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
