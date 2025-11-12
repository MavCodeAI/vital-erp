import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Shield, 
  TrendingUp, 
  Sparkles,
  BarChart3,
  Users,
  Package,
  DollarSign,
  Star,
  Play
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-xl z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-primary shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="text-xl font-bold text-primary">ErpMax</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all"></span>
            </a>
            <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Benefits
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all"></span>
            </a>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-6 px-4 py-2 bg-gradient-primary border-0 shadow-lg animate-bounce">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="font-semibold">170+ Features • Trusted by 10K+ Businesses</span>
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight">
              Transform Your
              <span className="block mt-2 text-primary">
                Business Today
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              The most powerful, intuitive, and affordable ERP system built for 
              <span className="text-primary font-semibold"> Pakistani businesses</span>. 
              Start managing everything in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary text-lg px-10 py-6 shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 hover:bg-primary/5 border-2">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-8 rounded-2xl bg-card border-2 hover:border-primary hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="text-5xl font-black text-primary mb-3">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <Star className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need in
              <span className="block text-primary">one platform</span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Streamline your operations with our comprehensive suite of business tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl border-2 bg-card hover:border-primary hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity"></div>
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-primary shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for modern businesses
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                ErpMax combines powerful features with an intuitive interface, 
                making it easy to manage every aspect of your business.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-primary/10 border"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="text-2xl font-bold">170+ Features</p>
                  <p className="text-muted-foreground">Ready to use</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Badge className="mb-6 px-4 py-2 bg-gradient-primary border-0 shadow-lg">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="font-semibold">Start Your Free Trial Today</span>
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Ready to
            <span className="block text-primary">Transform Your Business?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join <span className="text-primary font-bold">10,000+ businesses</span> already using ErpMax to streamline 
            operations and boost productivity by <span className="text-primary font-bold">300%</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary text-lg px-12 py-6 shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all">
                Get Started Free
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-12 py-6 border-2 hover:bg-primary/5">
                Talk to Sales
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                  E
                </div>
                <span className="text-lg font-bold text-primary">ErpMax</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Modern ERP solution for growing businesses in Pakistan.
              </p>
              <div className="flex gap-3">
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-primary">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link to="/features" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link to="/signup" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Free Trial
                  </Link>
                </li>
                <li>
                  <a href="#benefits" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Benefits
                  </a>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 ErpMax. All rights reserved. Made with ❤️ in Pakistan
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "170+", label: "Features" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" }
];

const features = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Real-time insights and powerful reports to make data-driven decisions."
  },
  {
    icon: Package,
    title: "Inventory Control",
    description: "Track stock levels, manage warehouses, and automate reorder points."
  },
  {
    icon: DollarSign,
    title: "Financial Management",
    description: "Complete accounting solution with invoicing, expenses, and tax management."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with role-based access and real-time updates."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, automated backups, and compliance ready."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with instant search and real-time sync."
  }
];

const benefits = [
  {
    title: "Real-time Analytics",
    description: "Make data-driven decisions with live dashboards and reports"
  },
  {
    title: "Automated Workflows",
    description: "Save time with intelligent automation and smart notifications"
  },
  {
    title: "Multi-user Access",
    description: "Collaborate seamlessly with role-based permissions"
  },
  {
    title: "Mobile Ready",
    description: "Manage your business on the go with responsive design"
  }
];
