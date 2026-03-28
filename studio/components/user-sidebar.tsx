"use client";

import Link from "next/link";
import Image from "next/image";
import { PilotFAABrandContent } from "@/components/pilotfaa-brand";
import { cn } from "@/lib/utils";
import {
  Home,
  Gauge,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  TrendingUp,
  Settings,
} from "lucide-react";

interface UserSidebarProps {
  currentPath: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function UserSidebar({ currentPath, collapsed = false, onToggle }: UserSidebarProps) {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Your main workspace"
    },
    // DEPRECATED: Site Audit removed
    // {
    //   title: "Site Audit",
    //   href: "/dashboard/site-audit",
    //   icon: Search,
    //   description: "Comprehensive site analysis"
    // },
    {
      title: "Performance",
      href: "/dashboard/performance",
      icon: Gauge,
      description: "Performance metrics and analysis"
    },
    {
      title: "Monitoring",
      href: "/dashboard/monitoring",
      icon: TrendingUp,
      description: "Real-time tracking"
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      description: "Analytics and reports"
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Configure your preferences"
    }
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen border-r border-gray-200 bg-gray-100 shadow-lg transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Fixed Logo Header */}
      <div className={cn("flex-shrink-0 flex items-center border-b border-gray-200", collapsed ? "justify-center p-4" : "justify-between p-6")}>
        <Link href="/" className={cn("flex items-center", collapsed ? "justify-center" : "")}>
          {collapsed ? (
            <Image
              src="/pilotfaa-wordmark.png"
              alt="PilotFAA"
              width={40}
              height={40}
              className="object-contain"
              priority
              unoptimized
            />
          ) : (
            <PilotFAABrandContent width={140} height={36} />
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn("rounded-lg p-2 text-gray-500 hover:text-palette-primary hover:bg-white/70 transition", collapsed ? "ml-0" : "ml-auto")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Scrollable Navigation Content */}
      <div className={cn("flex-1 overflow-y-auto", collapsed ? "p-4" : "p-6")}>
        <div className={cn("flex flex-col", collapsed ? "gap-6" : "gap-8")}>
        {/* Main Navigation */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Dashboard
            </h3>
          )}
          <nav className={cn("space-y-2", collapsed && "space-y-3") }>
            {sidebarItems.map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-palette-primary text-white shadow-md"
                      : "text-gray-700 hover:text-palette-primary hover:bg-palette-accent-3",
                    collapsed ? "justify-center" : "space-x-3"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>
                  )}
                  {isActive && !collapsed && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Coming Soon Section removed */}
        </div>
      </div>
    </aside>
  );
}
