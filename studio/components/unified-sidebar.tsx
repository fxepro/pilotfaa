"use client";

import Link from "next/link";
import { PilotFAABrandContent, PILOTFAA_TAGLINE } from "@/components/pilotfaa-brand";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  ChevronLeft,
  Home,
  LayoutDashboard,
  Search,
  Gauge,
  Activity,
  TrendingUp,
  BarChart3,
  Shield,
  Users,
  Monitor,
  Network,
  Wrench,
  Palette,
  MessageSquare,
  CreditCard,
  Settings,
  User as UserIcon,
  Cpu,
  Plug,
  Package,
  Clock,
  Cloud,
  Globe,
  CircleDollarSign,
  MapPin,
  Lock,
  Brain,
  Database,
  FileText,
  ShoppingCart,
  Boxes,
  Receipt,
  Truck,
  Tag,
  Server,
  FolderOpen,
  DollarSign,
  BookOpen,
  Building2,
  Repeat,
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  permission?: string;
  badge?: string | null;
}

interface NavigationSection {
  id: string;
  title: string;
  icon?: string;
  permission?: string;
  items: NavigationItem[];
}

interface UnifiedSidebarProps {
  navigation: {
    sections: NavigationSection[];
  } | null;
  currentPath: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  LayoutDashboard,
  Search,
  Gauge,
  Activity,
  TrendingUp,
  BarChart3,
  Shield,
  Users,
  Monitor,
  Network,
  Wrench,
  Palette,
  MessageSquare,
  CreditCard,
  Settings,
  User: UserIcon,
  Tool: Wrench, // Use Wrench as alternative for Tool icon (Tool doesn't exist in lucide-react)
  Cpu, // AI Health icon
  Plug, // Integrations icon
  Package, // WordPress icon
  Clock, // Coming Soon icon
  Cloud, // Cloud Monitoring icon
  Globe, // Multi-lingual icon
  CircleDollarSign, // Multi-currency icon
  MapPin, // Multi-location icon
  Lock, // Security icon
  Brain, // AI Models icon
  Database, // Databases icon
  FileText, // Blogging icon
  ShoppingCart, // Products icon
  Boxes, // Inventory icon
  Receipt, // Invoicing icon
  Truck, // Purchasing icon
  Tag, // Pricing icon
  Server,
  FolderOpen,
  DollarSign,
  BookOpen,
  Building2,
  Repeat,
};

function navItemIsActive(pathname: string, searchParams: URLSearchParams, itemHref: string): boolean {
  const [path, queryPart] = itemHref.split("?");
  if (pathname !== path) {
    return false;
  }
  if (!queryPart) {
    return true;
  }
  const itemParams = new URLSearchParams(queryPart);
  const itemTab = itemParams.get("tab");
  if (itemTab == null) {
    return true;
  }
  const currentTab = searchParams.get("tab");
  if (path === "/workspace/profile" && itemTab === "profile") {
    return !currentTab || currentTab === "profile";
  }
  return currentTab === itemTab;
}

export function UnifiedSidebar({ navigation, currentPath, collapsed = false, onToggle }: UnifiedSidebarProps) {
  const { hasPermission, permissions } = usePermissions();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!navigation || !navigation.sections) {
    return (
      <aside className={cn(
        "pf-workspace-sidebar fixed left-0 top-0 h-screen transition-all duration-300 flex flex-col z-40",
        collapsed ? "w-20" : "w-64"
      )}>
        <div className="p-4 text-sm text-slate-500">No navigation available</div>
      </aside>
    );
  }

  // Navigation is already filtered on backend by permissions
  // Use it directly - backend filtering is the source of truth
  const filteredSections = navigation.sections.filter(section => 
    section.items && section.items.length > 0
  );

  // Transform navigation: Rename Monitoring to Site Monitoring
  const transformedSections = filteredSections.map(section => ({
    ...section,
    items: section.items.map(item => {
      // Rename "Monitoring" to "Site Monitoring"
      if (item.id === 'monitoring' && item.title === 'Monitoring') {
        return { ...item, title: 'Site Monitoring' };
      }
      return { ...item };
    })
  }));

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Sidebar - Navigation sections:', navigation.sections.length);
    console.log('Sidebar - Filtered sections:', transformedSections.length);
    console.log('Sidebar - Permissions:', permissions.length);
  }

  return (
    <aside
      className={cn(
        "pf-workspace-sidebar fixed left-0 top-0 h-screen transition-all duration-300 flex flex-col z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn(
        "pf-workspace-sidebar-brand flex-shrink-0 flex items-center",
        collapsed ? "justify-center p-4" : "justify-between px-4 py-5"
      )}>
        {!collapsed && (
          <Link href="/" className="flex min-w-0 items-center no-underline group">
            <PilotFAABrandContent
              width={100}
              height={28}
              className="min-w-0 max-w-[calc(100%-2.5rem)]"
              imageClassName="max-h-7 w-auto max-w-[min(100%,7rem)]"
              taglineClassName="text-[9px] leading-tight text-slate-500 sm:text-[10px]"
            />
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="flex items-center justify-center no-underline" title={`PilotFAA — ${PILOTFAA_TAGLINE}`}>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
              style={{ background: "linear-gradient(135deg,#1756C8,#4A7AE0)" }}
            >
              ✈
            </span>
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "rounded-lg p-2 text-slate-500 hover:text-palette-primary hover:bg-palette-accent-3 transition",
            collapsed ? "ml-0" : "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className={cn("flex-1 overflow-y-auto bg-[#F8FAFC]", collapsed ? "p-4" : "p-5")}>
        <div className={cn("flex flex-col", collapsed ? "gap-6" : "gap-8")}>
          {transformedSections.map((section) => (
            <div key={section.id}>
              {!collapsed && (
                <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 font-mono">
                  {section.title}
                </h3>
              )}
              <nav className={cn("space-y-2", collapsed && "space-y-3")}>
                {section.items.map((item) => {
                  const isActive = navItemIsActive(pathname, searchParams, item.href);
                  const IconComponent = item.icon ? iconMap[item.icon] : null;
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-palette-primary text-white shadow-md"
                          : "text-gray-700 hover:text-palette-primary hover:bg-palette-accent-3",
                        collapsed ? "justify-center" : "space-x-3"
                      )}
                    >
                      {IconComponent && <IconComponent className="h-5 w-5 flex-shrink-0" />}
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                        </div>
                      )}
                      {isActive && !collapsed && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

