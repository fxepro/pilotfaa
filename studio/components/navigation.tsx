"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Activity, BarChart3, Zap, Shield, Code, Brain, Link2, MessageCircle, Gauge, Eye, Lock, FileText, Menu, X, Server, Type, CreditCard, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { PilotFAABrandContent } from "@/components/pilotfaa-brand";

// Use relative URL in production (browser), localhost in dev (SSR)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update loggedIn state on mount, route change, and storage events
  useEffect(() => {
    const checkAuthState = () => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem("access_token");
      const isLoggedIn = !!token;
      setLoggedIn(isLoggedIn);
      
      if (token) {
        // Fetch user info to check roles
        fetch(`${API_BASE}/api/user-info/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Unauthorized');
          })
          .then(data => setUser(data))
          .catch(() => {
            // Token invalid, clear it
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setLoggedIn(false);
            setUser(null);
          });
      } else {
        setUser(null);
      }
    };

    checkAuthState();
    // Listen for storage changes (e.g., logout from another tab)
    window.addEventListener("storage", checkAuthState);
    return () => window.removeEventListener("storage", checkAuthState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem("access_token");
    const isLoggedIn = !!token;
    setLoggedIn(isLoggedIn);
    
    if (token) {
      fetch(`${API_BASE}/api/user-info/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Unauthorized');
        })
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setLoggedIn(false);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    // Clear orchestrator state to prevent old reports from running
    localStorage.removeItem("pagerodeo_analysis_state");
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="border-b border-palette-accent-2/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50">
      <div className="w-full px-4">
        <div className="flex h-20 items-center justify-between max-w-[1600px] mx-auto">
          {/* Left side - Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="group">
              <PilotFAABrandContent
                width={150}
                height={38}
                className="group-hover:opacity-90 transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Center - Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-12">
            <div className="flex items-center space-x-6">
                <Link
                  href="/features"
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap",
                    pathname === "/features"
                      ? "text-palette-primary after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full"
                      : "text-slate-600 hover:text-palette-primary",
                  )}
                >
                  <Zap className="h-4 w-4 mr-1.5" />
                  Features
                </Link>
                <Link
                  href="/financials"
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap",
                    pathname === "/financials"
                      ? "text-palette-primary after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full"
                      : "text-slate-600 hover:text-palette-primary",
                  )}
                >
                  <CreditCard className="h-4 w-4 mr-1.5" />
                  Financials
                </Link>
                <Link
                  href="/analytics"
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap",
                    pathname === "/analytics"
                      ? "text-palette-primary after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full"
                      : "text-slate-600 hover:text-palette-primary",
                  )}
                >
                  <BarChart3 className="h-4 w-4 mr-1.5" />
                  Analytics
                </Link>
                <Link
                  href="/databases"
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap",
                    pathname === "/databases"
                      ? "text-palette-primary after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full"
                      : "text-slate-600 hover:text-palette-primary",
                  )}
                >
                  <Server className="h-4 w-4 mr-1.5" />
                  Databases
                </Link>
                <Link
                  href="/seo"
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap",
                    pathname === "/seo"
                      ? "text-palette-primary after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full"
                      : "text-slate-600 hover:text-palette-primary",
                  )}
                >
                  <Search className="h-4 w-4 mr-1.5" />
                  SEO
                </Link>
                <Link
                  href="/api"
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 hover:text-palette-primary relative py-2 px-2 flex items-center whitespace-nowrap",
                    pathname === "/api"
                      ? "text-palette-primary after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-palette-primary after:rounded-full"
                      : "text-slate-600 hover:text-palette-primary",
                  )}
                >
                  <Code className="h-4 w-4 mr-1.5" />
                  API
                </Link>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button 
                variant="outline"
                className="border-palette-accent-2 text-palette-primary hover:bg-palette-accent-3 transition-all duration-300 px-3 py-2 text-sm"
                asChild
              >
                <Link href="/feedback">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Feedback
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="border-palette-accent-2 text-palette-primary hover:bg-palette-accent-3 transition-all duration-300 px-3 py-2 text-sm"
                asChild
              >
                <Link href="/consult">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Consult
                </Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-palette-accent-1 to-palette-primary hover:from-palette-primary hover:to-palette-primary-hover text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 px-3 py-2 text-sm" 
                asChild
              >
                <Link href="/plans">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Plans
                </Link>
              </Button>
              {loggedIn ? (
                <Button
                  className="bg-white text-palette-primary border border-palette-accent-1 hover:bg-palette-accent-3 transition-all duration-300 px-3 py-2 text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  className="bg-white text-palette-primary border border-palette-accent-1 hover:bg-palette-accent-3 transition-all duration-300 px-3 py-2 text-sm"
                  asChild
                >
                  <Link href="/login">
                    Login
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
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
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/features"
                      ? "bg-palette-accent-3 text-palette-primary"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="h-4 w-4" />
                  <span>Features</span>
                </Link>
                <Link
                  href="/financials"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/financials"
                      ? "bg-palette-accent-3 text-palette-primary"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Financials</span>
                </Link>
                <Link
                  href="/analytics"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/analytics"
                      ? "bg-palette-accent-3 text-palette-primary"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="/databases"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/databases"
                      ? "bg-palette-accent-3 text-palette-primary"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Server className="h-4 w-4" />
                  <span>Databases</span>
                </Link>
                <Link
                  href="/seo"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/seo"
                      ? "bg-palette-accent-3 text-palette-primary"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="h-4 w-4" />
                  <span>SEO</span>
                </Link>
                <Link
                  href="/api"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/api"
                      ? "bg-palette-accent-3 text-palette-primary"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Code className="h-4 w-4" />
                  <span>API</span>
                </Link>
                <Link
                  href="/api"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/api"
                      ? "bg-palette-accent-3 text-palette-primary"
                      : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Code className="h-4 w-4" />
                  <span>API</span>
                </Link>
                <Button 
                  variant="outline"
                  className="w-full border-palette-accent-2 text-palette-primary hover:bg-palette-accent-3"
                  asChild
                >
                  <Link href="/feedback" onClick={() => setMobileMenuOpen(false)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Feedback
                  </Link>
                </Button>
                {loggedIn && user && user.roles && user.roles.includes('Admin') && (
                  <Link
                    href="/workspace/admin-overview"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname.startsWith("/workspace")
                        ? "bg-palette-accent-3 text-palette-primary"
                        : "text-slate-600 hover:bg-palette-accent-3 hover:text-palette-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 border-t border-palette-accent-2/20 space-y-3">
                <Button 
                  variant="outline"
                  className="w-full border-palette-accent-2 text-palette-primary hover:bg-palette-accent-3"
                  asChild
                >
                  <Link href="/consult" onClick={() => setMobileMenuOpen(false)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Consult
                  </Link>
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-palette-accent-1 to-palette-primary hover:from-palette-primary hover:to-palette-primary-hover text-white" 
                  asChild
                >
                  <Link href="/plans" onClick={() => setMobileMenuOpen(false)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Plans
                  </Link>
                </Button>
                {loggedIn ? (
                  <Button
                    className="w-full bg-white text-palette-primary border border-palette-accent-1 hover:bg-palette-accent-3"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-white text-palette-primary border border-palette-accent-1 hover:bg-palette-accent-3"
                    asChild
                  >
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
