import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  AlertTriangle,
  BarChart3,
  Settings,
  Box,
  BrainCircuit,
  FileBarChart,
  Users,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Invoices", icon: FileText, path: "/invoices" },
  { label: "Customers", icon: Users, path: "/customers" },
  { label: "Returns", icon: RotateCcw, path: "/returns" },
  { label: "Audit Logs", icon: ShieldAlert, path: "/audit-logs" },
  { label: "Forecast", icon: BrainCircuit, path: "/demand-forecast" },
  { label: "GST Reports", icon: FileBarChart, path: "/gst-report" },
  { label: "Alerts", icon: AlertTriangle, path: "/alerts" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Box className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-foreground">InvenTrack</h1>
          <p className="text-xs text-sidebar-muted">Inventory & Billing</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-foreground">
            SP
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Sakshi Patil</p>
            <p className="text-xs text-sidebar-muted">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
