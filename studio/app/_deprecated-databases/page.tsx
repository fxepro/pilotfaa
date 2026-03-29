"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/hero-section"
import { 
  Database, 
  Key, 
  Layers, 
  Code, 
  Activity, 
  Download,
  Shield,
  CheckCircle,
  Rocket,
  Zap,
  Server,
  Lock,
  Eye,
  Settings
} from "lucide-react"

export default function DatabasesPage() {
  const features = [
    {
      id: "multi-database",
      title: "Multi-Database Support",
      description: "Connect to PostgreSQL, MySQL, and SQLite databases with easy setup and management.",
      icon: Database,
      details: [
        "PostgreSQL support",
        "MySQL compatibility",
        "SQLite integration",
        "Easy connection setup"
      ]
    },
    {
      id: "connection-management",
      title: "Connection Management",
      description: "Securely store and manage database credentials with encrypted credential storage.",
      icon: Key,
      details: [
        "Encrypted credential storage",
        "Connection testing",
        "Status monitoring",
        "Multiple connections"
      ]
    },
    {
      id: "schema-browser",
      title: "Schema Browser",
      description: "Explore database schemas, tables, columns, and relationships with an intuitive interface.",
      icon: Layers,
      details: [
        "Table exploration",
        "Column inspection",
        "Relationship mapping",
        "Schema visualization"
      ]
    },
    {
      id: "query-interface",
      title: "Query Interface",
      description: "Execute safe SQL queries with syntax highlighting, result visualization, and query history.",
      icon: Code,
      details: [
        "SQL editor",
        "Safe query execution",
        "Result visualization",
        "Query history"
      ]
    },
    {
      id: "performance-monitoring",
      title: "Performance Monitoring",
      description: "Track query performance, connection statistics, and database resource usage in real-time.",
      icon: Activity,
      details: [
        "Query performance metrics",
        "Connection statistics",
        "Resource usage tracking",
        "Real-time monitoring"
      ]
    },
    {
      id: "data-export",
      title: "Data Export",
      description: "Export data in multiple formats, schedule backups, and migrate data between databases.",
      icon: Download,
      details: [
        "CSV/JSON export",
        "Scheduled backups",
        "Data migration tools",
        "Bulk operations"
      ]
    }
  ]

  const securityFeatures = [
    {
      title: "Encrypted Connections",
      description: "All database connections use encrypted protocols to protect your data in transit.",
      icon: Lock
    },
    {
      title: "Role-Based Access",
      description: "Control who can access which databases with granular permission management.",
      icon: Shield
    },
    {
      title: "Audit Logging",
      description: "Track all database operations with comprehensive audit logs for security compliance.",
      icon: Eye
    },
    {
      title: "Secure Credentials",
      description: "Database passwords are encrypted at rest using industry-standard encryption.",
      icon: Key
    }
  ]

  const useCases = [
    {
      title: "Multi-Tenant Applications",
      description: "Manage separate databases for each tenant with centralized administration.",
      icon: Server
    },
    {
      title: "Data Migration",
      description: "Easily migrate data between databases with built-in migration tools.",
      icon: Database
    },
    {
      title: "Database Administration",
      description: "Manage multiple databases from a single interface without switching tools.",
      icon: Settings
    },
    {
      title: "Development Workflows",
      description: "Connect to local and remote databases for seamless development and testing.",
      icon: Code
    }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection
        badge={{
          text: "Database Management",
          icon: Database,
        }}
        title="Powerful Database Management"
        description="Connect, manage, and monitor multiple databases with secure credential storage and intuitive tools"
        primaryAction={{
          text: "Manage Databases",
          href: "/workspace/databases",
          icon: Database,
        }}
        secondaryAction={{
          text: "View All Features",
          href: "/features",
          icon: Rocket,
        }}
        // gradientVia="via-palette-secondary"
      />

      {/* Features Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-secondary/30 text-palette-secondary">
              <Zap className="h-4 w-4 mr-2" />
              Database Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to Manage Databases
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive database management tools built into your admin platform foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.id} className="border-2 border-slate-200 hover:border-palette-secondary/50 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-palette-secondary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-palette-secondary" />
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

      {/* Security Features */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-primary/30 text-palette-primary">
              <Shield className="h-4 w-4 mr-2" />
              Security First
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your database connections and credentials are protected with industry-standard security measures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="border-2 border-slate-200 hover:border-palette-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-palette-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-palette-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Perfect for Any Database Workflow
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whether you're managing multiple databases or migrating data, Admin Rodeo has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon
              return (
                <Card key={idx} className="border-2 border-slate-200 hover:border-palette-secondary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-palette-secondary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-palette-secondary" />
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

      {/* Database Support */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Supported Databases
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Connect to the databases you're already using
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🐘</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">PostgreSQL</h3>
                <p className="text-slate-600">Full support for PostgreSQL databases with advanced features</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">🗄️</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">MySQL</h3>
                <p className="text-slate-600">Compatible with MySQL and MariaDB databases</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">💾</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">SQLite</h3>
                <p className="text-slate-600">Perfect for development and small-scale applications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-palette-secondary to-palette-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="border-white/30 text-white bg-white/10 px-4 py-2 mb-6">
            <Database className="h-4 w-4 mr-2" />
            Ready to Manage Your Databases?
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Managing Databases Today
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get access to powerful database management tools as part of the Admin Rodeo platform foundation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-palette-primary hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
              asChild
            >
              <Link href="/workspace/databases">
                <Database className="mr-2 h-5 w-5" />
                Access Database Manager
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg transition-all duration-300"
              asChild
            >
              <Link href="/features">
                <Rocket className="mr-2 h-5 w-5" />
                View All Features
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

