import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award, TrendingUp, Heart, Zap } from "lucide-react";

export default function About() {
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
            <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium text-primary">
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
            Building the Future of Business Management
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to help businesses of all sizes streamline their operations 
            and achieve sustainable growth through innovative technology.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To empower businesses with intuitive, powerful, and affordable ERP solutions 
                  that simplify complex operations and drive growth. We believe every business 
                  deserves access to enterprise-grade tools without the enterprise complexity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  To become the most trusted and user-friendly ERP platform globally, 
                  enabling millions of businesses to operate more efficiently, make better 
                  decisions, and achieve their full potential through technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Built by Experts</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team consists of experienced developers, business analysts, and industry experts 
            who understand the challenges businesses face. We're committed to creating solutions 
            that truly make a difference.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join thousands of businesses using ErpMax
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your free trial today and experience the difference
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-primary">
              Get Started Free
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

const values = [
  {
    icon: Users,
    title: "Customer First",
    description: "We prioritize our customers' success above everything else"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Constantly improving and adapting to meet evolving needs"
  },
  {
    icon: Heart,
    title: "Simplicity",
    description: "Making complex business processes simple and intuitive"
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering the highest quality in everything we do"
  },
  {
    icon: Target,
    title: "Transparency",
    description: "Open and honest in all our communications and practices"
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "Helping businesses and our team members grow together"
  }
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "170+", label: "Features" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" }
];
