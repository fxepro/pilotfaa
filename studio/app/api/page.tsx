"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/hero-section"
import { 
  Code, 
  Key, 
  Activity, 
  Gauge, 
  Webhook, 
  FileText,
  CheckCircle,
  Rocket,
  Zap,
  Shield,
  Box,
  Globe,
  Terminal,
  Lock
} from "lucide-react"

export default function APIPage() {
  const features = [
    {
      id: "restful",
      title: "RESTful Architecture",
      description: "Standard HTTP methods with JSON responses and consistent API structure.",
      icon: Code,
      details: [
        "Standard HTTP methods",
        "JSON request/response",
        "Consistent structure",
        "RESTful best practices"
      ]
    },
    {
      id: "authentication",
      title: "Authentication",
      description: "Secure API access with JWT tokens, API keys, and OAuth support.",
      icon: Key,
      details: [
        "JWT token authentication",
        "API key support",
        "OAuth integration",
        "Token refresh"
      ]
    },
    {
      id: "monitoring",
      title: "API Monitoring",
      description: "Monitor endpoint health, track performance, and get real-time error alerts.",
      icon: Activity,
      details: [
        "Endpoint health checks",
        "Performance tracking",
        "Error monitoring",
        "Real-time alerts"
      ]
    },
    {
      id: "rate-limiting",
      title: "Rate Limiting",
      description: "Protect your API with request throttling and quota management.",
      icon: Gauge,
      details: [
        "Request throttling",
        "Quota management",
        "Fair usage policies",
        "Custom rate limits"
      ]
    },
    {
      id: "webhooks",
      title: "Webhooks",
      description: "Receive real-time event notifications and integrate with external services.",
      icon: Webhook,
      details: [
        "Event notifications",
        "Real-time updates",
        "Custom integrations",
        "Retry mechanisms"
      ]
    },
    {
      id: "documentation",
      title: "API Documentation",
      description: "Comprehensive interactive documentation with code examples and SDK support.",
      icon: FileText,
      details: [
        "Interactive docs",
        "Code examples",
        "SDK support",
        "API reference"
      ]
    }
  ]

  const endpoints = [
    {
      category: "User Management",
      description: "Manage users, authentication, and profiles",
      endpoints: ["/api/users/", "/api/auth/", "/api/profile/"]
    },
    {
      category: "Database",
      description: "Database connection and query management",
      endpoints: ["/api/admin/databases/", "/api/admin/databases/{id}/query/"]
    },
    {
      category: "Analytics",
      description: "Access analytics and reporting data",
      endpoints: ["/api/analytics/", "/api/reports/"]
    },
    {
      category: "Admin",
      description: "Administrative functions and settings",
      endpoints: ["/api/admin/", "/api/settings/"]
    }
  ]

  const sdks = [
    { name: "JavaScript/TypeScript", icon: "📘", description: "npm package for Node.js and browsers" },
    { name: "Python", icon: "🐍", description: "pip package for Python applications" },
    { name: "PHP", icon: "🐘", description: "Composer package for PHP projects" },
    { name: "Ruby", icon: "💎", description: "Gem package for Ruby applications" }
  ]

  const codeExample = `// Example: Fetching user data
const response = await fetch('https://api.adminrodeo.com/api/users/', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
});

const users = await response.json();
console.log(users);`

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection
        badge={{
          text: "RESTful API & Integration",
          icon: Code,
        }}
        title="Comprehensive API & Integration"
        description="RESTful API for seamless integrations with comprehensive documentation and SDK support"
        primaryAction={{
          text: "Access API",
          href: "/workspace",
          icon: Code,
        }}
        secondaryAction={{
          text: "View All Features",
          href: "/features",
          icon: Rocket,
        }}
        // gradientVia="via-palette-accent-1"
      />

      {/* Features Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-accent-1/30 text-palette-accent-1">
              <Zap className="h-4 w-4 mr-2" />
              API Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need for API Integration
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful API capabilities built into your admin platform foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.id} className="border-2 border-slate-200 hover:border-palette-accent-1/50 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-palette-accent-1/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-palette-accent-1" />
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

      {/* Available Endpoints */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-primary/30 text-palette-primary">
              <Globe className="h-4 w-4 mr-2" />
              API Endpoints
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Comprehensive API Coverage
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Access all platform features through well-documented REST endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {endpoints.map((category, idx) => (
              <Card key={idx} className="border-2 border-slate-200 hover:border-palette-primary/50 transition-all">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-900">{category.category}</CardTitle>
                  <CardDescription className="text-slate-600">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.endpoints.map((endpoint, eIdx) => (
                      <li key={eIdx} className="flex items-center gap-2 text-sm font-mono text-slate-700 bg-slate-100 p-2 rounded">
                        <Terminal className="h-4 w-4 text-palette-primary" />
                        <span>{endpoint}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SDK Support */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-secondary/30 text-palette-secondary">
              <Box className="h-4 w-4 mr-2" />
              SDK & Libraries
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Official SDKs for Your Stack
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started quickly with our official SDKs and libraries for popular programming languages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdks.map((sdk, idx) => (
              <Card key={idx} className="border-2 border-slate-200 hover:border-palette-secondary/50 transition-all text-center">
                <CardContent className="pt-6">
                  <div className="text-5xl mb-4">{sdk.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{sdk.name}</h3>
                  <p className="text-sm text-slate-600">{sdk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-accent-1/30 text-palette-accent-1">
              <Code className="h-4 w-4 mr-2" />
              Quick Start
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Simple API calls with clear examples to get you up and running quickly.
            </p>
          </div>

          <Card className="border-2 border-palette-accent-1/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Example: Fetching User Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-primary/30 text-palette-primary">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Secure by Default
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your API is protected with industry-standard security measures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <Lock className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">HTTPS Only</h3>
                <p className="text-slate-600">All API requests use encrypted HTTPS connections</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <Key className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Token-Based Auth</h3>
                <p className="text-slate-600">Secure JWT tokens with automatic refresh</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <Gauge className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Rate Limiting</h3>
                <p className="text-slate-600">Protection against abuse and overload</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-palette-accent-1 to-palette-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="border-white/30 text-white bg-white/10 px-4 py-2 mb-6">
            <Code className="h-4 w-4 mr-2" />
            Ready to Integrate?
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Building with Our API
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get access to comprehensive API documentation and start integrating Admin Rodeo into your applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-palette-primary hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
              asChild
            >
              <Link href="/workspace">
                <Code className="mr-2 h-5 w-5" />
                View API Docs
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

