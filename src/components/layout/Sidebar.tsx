import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Warehouse, 
  Calculator, 
  Users, 
  FolderKanban, 
  UserCircle, 
  Building2, 
  FileBarChart, 
  Settings,
  X,
  User,
  LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/lib/toast";

const modules = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Sales", icon: ShoppingCart, path: "/sales" },
  { name: "Purchase", icon: Package, path: "/purchase" },
  { name: "Inventory", icon: Warehouse, path: "/inventory" },
  { name: "Accounting", icon: Calculator, path: "/accounting" },
  { name: "HR", icon: Users, path: "/hr" },
  { name: "Projects", icon: FolderKanban, path: "/projects" },
  { name: "CRM", icon: UserCircle, path: "/crm" },
  { name: "Parties", icon: Building2, path: "/parties" },
  { name: "Reports", icon: FileBarChart, path: "/reports" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");
    
    showSuccess("Logged out successfully!");
    
    // Redirect to login
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="flex h-full flex-col">
        {/* Logo & Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">ErpMax</h1>
              <p className="text-xs text-sidebar-foreground/60">Enterprise Suite</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {modules.map((module) => (
              <NavLink
                key={module.path}
                to={module.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                onClick={onClose}
              >
                <module.icon className="h-5 w-5" />
                <span>{module.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
            onClick={onClose}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-white font-semibold text-xs">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Ahmed Khan</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">admin@erpmax.pk</p>
            </div>
            <User className="h-4 w-4" />
          </NavLink>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
    </>
  );
}
