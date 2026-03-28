"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, BarChart3, Zap, Shield, Code, Link2, Gauge, Eye, Lock, FileText, Menu, X, Server, Type, CreditCard, Search, Database } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function MainNavigation() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-palette-accent-2/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 sticky top-12 z-40">
      <div className="w-full px-4">
        <div className="flex h-16 items-center justify-between max-w-[1600px] mx-auto">
          {/* Left side - Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className={cn(
              "group relative",
              pathname === "/" && "after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
            )}>
              <Image 
                src="/adminrodeo-Logo-BIG-BLACK.png" 
                alt="Admin Rodeo Logo" 
                width={160} 
                height={40}
                className={cn(
                  "object-contain transition-all duration-300",
                  pathname === "/" ? "opacity-100" : "group-hover:opacity-90"
                )}
              />
            </Link>
          </div>

          {/* Right - Feature Navigation */}
          <div className="hidden lg:flex items-center justify-end flex-1 ml-12">
            <div className="flex items-center space-x-6">
              <Link
                href="/features"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/features" || pathname.startsWith("/features")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Zap className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/features" || pathname.startsWith("/features") ? "scale-110" : "group-hover:scale-110"
                )} />
                Features
              </Link>
              <Link
                href="/financials"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/financials" || pathname.startsWith("/financials")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <CreditCard className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/financials" || pathname.startsWith("/financials") ? "scale-110" : "group-hover:scale-110"
                )} />
                Financials
              </Link>
              <Link
                href="/analytics"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/analytics" || pathname.startsWith("/analytics")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <BarChart3 className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/analytics" || pathname.startsWith("/analytics") ? "scale-110" : "group-hover:scale-110"
                )} />
                Analytics
              </Link>
              <Link
                href="/databases"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/databases" || pathname.startsWith("/databases")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Database className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/databases" || pathname.startsWith("/databases") ? "scale-110" : "group-hover:scale-110"
                )} />
                Databases
              </Link>
              <Link
                href="/seo"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/seo" || pathname.startsWith("/seo")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Search className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/seo" || pathname.startsWith("/seo") ? "scale-110" : "group-hover:scale-110"
                )} />
                SEO
              </Link>
              <Link
                href="/api"
                className={cn(
                  "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap group",
                  pathname === "/api" || pathname.startsWith("/api")
                    ? "text-palette-primary font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full after:animate-pulse"
                    : "text-slate-600 hover:text-palette-primary",
                )}
              >
                <Code className={cn(
                  "h-4 w-4 mr-1.5 transition-transform duration-300",
                  pathname === "/api" || pathname.startsWith("/api") ? "scale-110" : "group-hover:scale-110"
                )} />
                API
              </Link>
            </div>
          </div>

          {/* Right side - Mobile Menu Button */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-palette-primary hover:bg-palette-accent-3 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-palette-accent-2/20 bg-white/95 backdrop-blur-md">
          <div className="px-6 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/features"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    pathname === "/features" || pathname.startsWith("/features")
                      ? "bg-palette-accent-3 text-palette-primary font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    pathname === "/features" || pathname.startsWith("/features") ? "scale-110" : ""
                  )} />
                  <span>Features</span>
                </Link>
                <Link
                  href="/financials"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    pathname === "/financials" || pathname.startsWith("/financials")
                      ? "bg-palette-accent-3 text-palette-primary font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CreditCard className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    pathname === "/financials" || pathname.startsWith("/financials") ? "scale-110" : ""
                  )} />
                  <span>Financials</span>
                </Link>
                <Link
                  href="/analytics"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    pathname === "/analytics" || pathname.startsWith("/analytics")
                      ? "bg-palette-accent-3 text-palette-primary font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    pathname === "/analytics" || pathname.startsWith("/analytics") ? "scale-110" : ""
                  )} />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="/databases"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    pathname === "/databases" || pathname.startsWith("/databases")
                      ? "bg-palette-accent-3 text-palette-primary font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Database className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    pathname === "/databases" || pathname.startsWith("/databases") ? "scale-110" : ""
                  )} />
                  <span>Databases</span>
                </Link>
                <Link
                  href="/seo"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    pathname === "/seo" || pathname.startsWith("/seo")
                      ? "bg-palette-accent-3 text-palette-primary font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    pathname === "/seo" || pathname.startsWith("/seo") ? "scale-110" : ""
                  )} />
                  <span>SEO</span>
                </Link>
                <Link
                  href="/api"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    pathname === "/api" || pathname.startsWith("/api")
                      ? "bg-palette-accent-3 text-palette-primary font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Code className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    pathname === "/api" || pathname.startsWith("/api") ? "scale-110" : ""
                  )} />
                  <span>API</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
