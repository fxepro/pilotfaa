"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/hero-section"
import { 
  Layout, 
  Users, 
  Shield, 
  Database, 
  Activity, 
  BarChart3, 
  Search,
  Wrench,
  CheckCircle,
  ArrowRight,
  Rocket,
  Code,
  Zap,
  Layers,
  Server,
  Key,
  FileText,
  Settings
} from "lucide-react"
import Image from "next/image"

export default function FeaturesPage() {
  const features = [
    {
      id: "admin-panel",
      title: "Admin Panel",
      description: "Pre-built dashboard with customizable layouts, role-based views, and intuitive navigation.",
      icon: Layout,
      color: "palette-primary",
      details: [
        "Customizable dashboard layouts",
        "Role-based views and permissions",
        "Responsive design",
        "Dark/light theme support"
      ]
    },
    {
      id: "user-management",
      title: "User Management",
      description: "Complete user authentication, profiles, email verification, and password management.",
      icon: Users,
      color: "palette-accent-1",
      details: [
        "JWT authentication",
        "User profiles & settings",
        "Email verification",
        "Password reset flows"
      ]
    },
    {
      id: "rbac",
      title: "Role-Based Access Control",
      description: "Granular permissions system with role management and permission matrix.",
      icon: Shield,
      color: "palette-accent-2",
      details: [
        "Flexible role system",
        "Permission matrix UI",
        "Feature-level access control",
        "Audit logging"
      ]
    },
    {
      id: "database",
      title: "Database Management",
      description: "Connect, manage, and monitor multiple databases with secure credential storage.",
      icon: Database,
      color: "palette-secondary",
      details: [
        "Multi-database support",
        "Schema browser",
        "Query interface",
        "Performance monitoring"
      ]
    },
    {
      id: "api-monitoring",
      title: "API Monitoring",
      description: "Monitor endpoint health, track performance, and ensure API reliability.",
      icon: Activity,
      color: "palette-accent-1",
      details: [
        "Endpoint health checks",
        "Performance tracking",
        "Error monitoring",
        "Real-time alerts"
      ]
    },
    {
      id: "analytics",
      title: "Analytics Dashboard",
      description: "Comprehensive analytics for users, system metrics, and business intelligence.",
      icon: BarChart3,
      color: "palette-accent-2",
      details: [
        "User analytics",
        "System metrics",
        "Custom reports",
        "Data visualization"
      ]
    },
    {
      id: "workspace-tools",
      title: "Workspace Tools",
      description: "Databases, AI models, feedback, and operational utilities from one workspace hub.",
      icon: Wrench,
      color: "palette-accent-3",
      details: [
        "Database connections",
        "Tools and integrations",
        "User feedback inbox",
        "System settings"
      ]
    },
    {
      id: "seo-monitoring",
      title: "SEO Monitoring",
      description: "Track and improve your site's search performance with comprehensive SEO tools.",
      icon: Search,
      color: "palette-secondary",
      details: [
        "Site analysis",
        "Performance tracking",
        "SEO insights",
        "Recommendations"
      ]
    }
  ]

  const techStack = [
    { name: "Django", description: "Backend Framework", icon: "🐍" },
    { name: "Next.js", description: "Frontend Framework", icon: "⚛️" },
    { name: "PostgreSQL", description: "Primary Database", icon: "🐘" },
    { name: "JWT", description: "Authentication", icon: "🔐" },
    { name: "REST API", description: "API Architecture", icon: "🌐" },
    { name: "TypeScript", description: "Type Safety", icon: "📘" }
  ]

  const useCases = [
    {
      title: "SaaS Platforms",
      description: "Build subscription-based applications with built-in billing and user management.",
      icon: Rocket
    },
    {
      title: "E-commerce",
      description: "Create online stores with product management, orders, and customer tracking.",
      icon: Layers
    },
    {
      title: "Content Management",
      description: "Build CMS platforms with content creation, publishing, and workflow management.",
      icon: FileText
    },
    {
      title: "Internal Tools",
      description: "Develop admin tools, dashboards, and internal applications for your team.",
      icon: Settings
    }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection
        badge={{
          text: "Complete Platform Foundation",
          icon: Rocket,
        }}
        title="Everything You Need to Build Faster"
        description="Complete admin platform foundation with pre-built components and features"
        primaryAction={{
          text: "Start Building",
          href: "/workspace",
          icon: Rocket,
        }}
        secondaryAction={{
          text: "View Pricing",
          href: "/plans",
          icon: Code,
        }}
      />

      {/* Features Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-primary/30 text-palette-primary">
              <Zap className="h-4 w-4 mr-2" />
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Built-In Features That Save You Time
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every feature you need to build a production-ready application, already implemented and ready to customize.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.id} className="border-2 border-slate-200 hover:border-palette-primary/50 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      feature.color === 'palette-primary' ? 'bg-palette-primary/10' :
                      feature.color === 'palette-accent-1' ? 'bg-palette-accent-1/10' :
                      feature.color === 'palette-accent-2' ? 'bg-palette-accent-2/10' :
                      feature.color === 'palette-secondary' ? 'bg-palette-secondary/10' :
                      'bg-palette-accent-3/10'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        feature.color === 'palette-primary' ? 'text-palette-primary' :
                        feature.color === 'palette-accent-1' ? 'text-palette-accent-1' :
                        feature.color === 'palette-accent-2' ? 'text-palette-accent-2' :
                        feature.color === 'palette-secondary' ? 'text-palette-secondary' :
                        'text-palette-accent-3'
                      }`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-600 mt-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Built on Modern Technology
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powered by industry-standard technologies for reliability, performance, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, idx) => (
              <Card key={idx} className="text-center border-2 border-slate-200 hover:border-palette-primary/50 transition-all">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{tech.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-1">{tech.name}</h3>
                  <p className="text-sm text-slate-600">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-primary/30 text-palette-primary">
              <Layers className="h-4 w-4 mr-2" />
              Use Cases
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Perfect for Any Application
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whether you're building a SaaS platform, e-commerce site, or internal tool, Admin Rodeo provides the foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon
              return (
                <Card key={idx} className="border-2 border-slate-200 hover:border-palette-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-palette-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-palette-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Build Faster, Ship Sooner
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how Admin Rodeo compares to building from scratch
            </p>
          </div>

          <Card className="border-2 border-palette-primary/30">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Building from Scratch</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-red-500">✗</span>
                      <span>3-6 months development time</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-red-500">✗</span>
                      <span>High development costs</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-red-500">✗</span>
                      <span>Security vulnerabilities risk</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-red-500">✗</span>
                      <span>Ongoing maintenance burden</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-palette-primary mb-4">With Admin Rodeo</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Start building in days, not months</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Production-ready foundation</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Built-in security best practices</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Focus on your unique features</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-palette-primary to-palette-secondary">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="border-white/30 text-white bg-white/10 px-4 py-2 mb-6">
            <Rocket className="h-4 w-4 mr-2" />
            Ready to Build Your Application?
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Building Faster Today
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get access to the complete Admin Rodeo platform foundation and start building your application on top of our proven admin platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-palette-primary hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
              asChild
            >
              <Link href="/workspace">
                <Rocket className="mr-2 h-5 w-5" />
                Access Workspace
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg transition-all duration-300"
              asChild
            >
              <Link href="/plans">
                <Code className="mr-2 h-5 w-5" />
                View Plans
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

