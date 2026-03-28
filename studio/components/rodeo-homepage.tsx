"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Rocket, 
  Layers, 
  Code, 
  Database, 
  Shield, 
  Users, 
  Settings, 
  Zap,
  CheckCircle,
  ArrowRight,
  Box,
  Layout,
  Server,
  Key,
  FileText
} from "lucide-react"

export function RodeoHomepage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-palette-primary to-slate-900">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse bg-palette-primary"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-2000 bg-palette-accent-1"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-55 animate-pulse animation-delay-4000 bg-palette-accent-2"></div>
          </div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8">
            <Badge variant="outline" className="border-palette-primary/40 text-white/80 bg-palette-primary/15 backdrop-blur-sm px-6 py-2 text-sm font-medium">
              <Rocket className="h-4 w-4 mr-2" />
              Admin Platform Foundation
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Rodeo Platform
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto mb-4 leading-relaxed">
            Build any application faster with our complete admin platform foundation
          </p>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            Pre-built admin panel, user management, authentication, and core functionality 
            that gives you a headstart on any project
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button size="lg" className="bg-palette-primary hover:bg-palette-primary-hover text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl" asChild>
              <Link href="/admin">
                <Layout className="mr-2 h-5 w-5" />
                Access Admin Panel
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-8 py-6 text-lg rounded-xl backdrop-blur-sm font-semibold" asChild>
              <Link href="/workspace">
                <Code className="mr-2 h-5 w-5" />
                View Workspace
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-medium">Ready to Use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-medium">Fully Customizable</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-medium">Production Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-primary/30 text-palette-primary">
              <Box className="h-4 w-4 mr-2" />
              Everything You Need
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Complete Admin Platform Foundation
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              All the core functionality you need to build any application, 
              pre-configured and ready to customize
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* User Management */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-palette-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-palette-primary to-palette-primary-hover flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Complete user authentication, roles, permissions, and profile management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    JWT Authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Role-Based Access Control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    User Profiles & Settings
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin Panel */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-palette-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-palette-accent-1 to-palette-accent-1 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layout className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Full-featured admin interface with dashboard, analytics, and management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Dashboard & Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    System Settings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Content Management
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Database & Backend */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-palette-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-palette-accent-2 to-palette-accent-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Database & Backend</CardTitle>
                <CardDescription>
                  Django REST API with PostgreSQL, organized schemas, and data models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Django REST Framework
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Schema Organization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    API Endpoints
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-palette-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Built-in security features, authentication, and access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    JWT Tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Permission System
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Rate Limiting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Frontend Framework */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-palette-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-palette-secondary to-palette-secondary-hover flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Frontend Framework</CardTitle>
                <CardDescription>
                  Next.js 15 with React 19, TypeScript, and modern UI components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Next.js App Router
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    UI Component Library
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Extensibility */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-palette-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-palette-accent-3 to-palette-accent-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6 text-palette-primary" />
                </div>
                <CardTitle>Extensible Architecture</CardTitle>
                <CardDescription>
                  Modular design that lets you add features and build on top of the foundation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Modular Apps
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Customizable
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Plugin Ready
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 to-palette-accent-3">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Build Your App Faster
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Start with a complete foundation and focus on building your unique features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="h-16 w-16 rounded-full bg-palette-accent-3 flex items-center justify-center mx-auto mb-6">
                <Server className="h-8 w-8 text-palette-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">1. Start with Foundation</h3>
              <p className="text-slate-600">
                Use the pre-built admin panel, user management, and core functionality as your starting point
              </p>
            </div>

            <div className="text-center p-8">
              <div className="h-16 w-16 rounded-full bg-palette-accent-3 flex items-center justify-center mx-auto mb-6">
                <Code className="h-8 w-8 text-palette-accent-1" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">2. Customize & Extend</h3>
              <p className="text-slate-600">
                Add your own features, pages, and functionality on top of the existing platform
              </p>
            </div>

            <div className="text-center p-8">
              <div className="h-16 w-16 rounded-full bg-palette-accent-3 flex items-center justify-center mx-auto mb-6">
                <Rocket className="h-8 w-8 text-palette-accent-2" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">3. Launch Faster</h3>
              <p className="text-slate-600">
                Deploy your application with all the core features already built and tested
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-palette-primary to-palette-secondary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Application?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Access the admin panel and start customizing the platform for your needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-palette-primary hover:bg-palette-accent-3 px-8 py-6 text-lg font-semibold rounded-xl shadow-xl" asChild>
              <Link href="/admin">
                <Layout className="mr-2 h-5 w-5" />
                Go to Admin Panel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-8 py-6 text-lg rounded-xl backdrop-blur-sm font-semibold" asChild>
              <Link href="/workspace">
                <FileText className="mr-2 h-5 w-5" />
                View Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

