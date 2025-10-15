import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Database,
  Sparkles,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  CreditCard,
} from "lucide-react";
import { cn } from "./ui/utils";
import { Separator } from "./ui/separator";
import { useAI } from "../context/AIContext";
import { generatePDF } from "../utils/pdfGenerator"; // ADDED
import { toast } from "sonner";                      // ADDED

interface MenuItem {
  icon: any;
  label: string;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const navigate = useNavigate();
  const location = useLocation();
  const { invoices } = useAI();

  // Your original menu sections are all here
  const menuSections: MenuSection[] = [
    {
      title: "MAIN",
      items: [
        { icon: Home, label: "Dashboard", path: "/" },
      ]
    },
    {
      title: "MANAGEMENT",
      items: [
        { icon: Database, label: "Data", path: "/data" },
        { icon: Sparkles, label: "Gen AI", path: "/gen-ai" },
        { icon: UserCircle, label: "Users", path: "/users" },
      ]
    },
    {
      title: "SETTINGS",
      items: [
        { icon: Settings, label: "Admin", path: "/admin" },
        { icon: CreditCard, label: "Billing", path: "/billing" },
      ]
    }
  ];
  
  // ADDED: New function to handle the PDF generation
  const handleRecentInvoiceClick = (invoiceId: string) => {
    const invoiceToDisplay = invoices.find(inv => inv.id === invoiceId);
    if (invoiceToDisplay) {
      try {
        generatePDF(invoiceToDisplay);
        toast.success("Opening PDF...", {
          description: `Generating invoice ${invoiceToDisplay.invoiceNumber}.`,
        });
      } catch (error) {
        toast.error("Failed to generate PDF.");
      }
    } else {
      toast.error("Could not find the selected invoice.");
    }
  };

  // UPDATED: Recent invoices list now stores the ID instead of a path
  const recentInvoices = invoices.slice(-3).reverse().map((invoice) => ({
    id: invoice.id,
    icon: FileText,
    label: `${invoice.invoiceNumber} - ${invoice.vendor.substring(0, 15)}${invoice.vendor.length > 15 ? '...' : ''}`,
  }));

  return (
    <div
      className={cn(
        "bg-white border-r border-slate-200 h-screen transition-all duration-300 relative overflow-y-auto",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* --- NO CHANGES BELOW HERE, EXCEPT FOR THE ONCLICK --- */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 hover:bg-slate-50 transition-colors z-10 shadow-sm"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-[#64748b]" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-[#64748b]" />
        )}
      </button>

      <div className={cn("p-4 border-b border-slate-200", isCollapsed ? "px-4" : "px-6")}>
        <h1 className={cn(
          "font-bold text-[#1e293b] transition-all",
          isCollapsed ? "text-lg" : "text-xl"
        )}>
          {isCollapsed ? "ME" : "My E-lnvoice"}
        </h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Menu Sections - This part is unchanged and still navigates normally */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <span className="text-xs text-[#64748b] uppercase tracking-wider">
                  {section.title}
                </span>
              </div>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                      isActive
                        ? "bg-[#2563eb] text-white"
                        : "text-[#64748b] hover:bg-slate-100"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Recent Invoices Section - This part now opens a PDF */}
        {recentInvoices.length > 0 && (
          <div className="pt-4">
            {!isCollapsed && <Separator className="mb-4" />}
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <span className="text-xs text-[#64748b] uppercase tracking-wider">
                  RECENT INVOICES
                </span>
              </div>
            )}
            <nav className="space-y-1">
              {recentInvoices.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    // UPDATED: The onClick now calls our new function to open the PDF
                    onClick={() => handleRecentInvoiceClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-[#64748b] hover:bg-slate-100"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}