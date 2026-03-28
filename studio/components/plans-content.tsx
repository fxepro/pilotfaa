"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SimpleHeroSection } from "@/components/simple-hero-section"
import { 
  Check, 
  Code,
  Database,
  Layers,
  Rocket,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Settings,
  Server,
  Lock
} from "lucide-react"

interface PlanData {
  name: string
  number: number
  price: string
  priceValue?: number
  tagline: string
  description: string
  icon: React.ReactNode
  color: string
  features: string[]
  idealFor: string
  ctaText: string
  ctaAction: () => void
  isHighlighted?: boolean
}

export function PlansContent() {

  // 6 Plans for Admin Rodeo Platform
  const pricingPlans: PlanData[] = [
    {
      name: "Plan 1",
      number: 1,
      price: "Free",
      priceValue: 0,
      tagline: "Get started with the foundation",
      description: "Perfect for testing and exploring the Admin Rodeo platform. Includes core admin panel, basic user management, and essential features to build your first application.",
      icon: <Zap className="h-8 w-8" />,
      color: "#10B981",
      features: [
        "Admin Panel Access",
        "Basic User Management",
        "JWT Authentication",
        "Core Database Schema",
        "Basic API Endpoints",
        "Documentation Access",
        "Community Support"
      ],
      idealFor: "Developers exploring the platform or building small personal projects.",
      ctaText: "Get Started Free",
      ctaAction: () => window.location.href = "/admin",
      isHighlighted: false
    },
    {
      name: "Plan 2",
      number: 2,
      price: "$49/mo",
      priceValue: 49,
      tagline: "Build your first production app",
      description: "Everything you need to launch a single application. Includes advanced user management, role-based access control, and production-ready features.",
      icon: <Code className="h-8 w-8" />,
      color: "#3B82F6",
      features: [
        "Everything in Plan 1",
        "Role-Based Access Control (RBAC)",
        "Advanced User Profiles",
        "Email Verification",
        "Password Reset",
        "Basic Analytics Dashboard",
        "Priority Documentation",
        "Email Support"
      ],
      idealFor: "Startups and small businesses building their first application.",
      ctaText: "Start Plan 2",
      ctaAction: () => handlePlanSelect("Plan 2", 49),
      isHighlighted: true
    },
    {
      name: "Plan 3",
      number: 3,
      price: "$149/mo",
      priceValue: 149,
      tagline: "Scale with multiple applications",
      description: "Build and manage multiple applications on the platform. Includes multi-tenant support, advanced permissions, and enhanced security features.",
      icon: <Layers className="h-8 w-8" />,
      color: "#8B5CF6",
      features: [
        "Everything in Plan 2",
        "Multi-Application Support",
        "Advanced Permissions System",
        "Custom Schema Support",
        "API Rate Limiting",
        "Enhanced Security Features",
        "Advanced Analytics",
        "Priority Email Support"
      ],
      idealFor: "Growing businesses managing multiple applications or SaaS products.",
      ctaText: "Start Plan 3",
      ctaAction: () => handlePlanSelect("Plan 3", 149),
      isHighlighted: false
    },
    {
      name: "Plan 4",
      number: 4,
      price: "$299/mo",
      priceValue: 299,
      tagline: "Enterprise-ready features",
      description: "Advanced features for larger teams. Includes audit logging, advanced reporting, custom integrations, and dedicated support channels.",
      icon: <Shield className="h-8 w-8" />,
      color: "#F59E0B",
      features: [
        "Everything in Plan 3",
        "Audit Logging & Compliance",
        "Advanced Reporting & Analytics",
        "Custom Integrations",
        "Webhook Support",
        "Advanced Security Scanning",
        "Custom Branding Options",
        "Dedicated Support Channel"
      ],
      idealFor: "Mid-size companies requiring compliance, reporting, and advanced security.",
      ctaText: "Start Plan 4",
      ctaAction: () => handlePlanSelect("Plan 4", 299),
      isHighlighted: false
    },
    {
      name: "Plan 5",
      number: 5,
      price: "$599/mo",
      priceValue: 599,
      tagline: "White-label and customization",
      description: "Full platform customization with white-label options, custom modules, advanced API access, and dedicated infrastructure support.",
      icon: <Settings className="h-8 w-8" />,
      color: "#EF4444",
      features: [
        "Everything in Plan 4",
        "White-Label Platform",
        "Custom Module Development",
        "Advanced API Access",
        "Custom Database Schemas",
        "Dedicated Infrastructure Support",
        "Custom Integrations Development",
        "Dedicated Account Manager"
      ],
      idealFor: "Agencies and enterprises needing white-label solutions and custom development.",
      ctaText: "Start Plan 5",
      ctaAction: () => handlePlanSelect("Plan 5", 599),
      isHighlighted: false
    },
    {
      name: "Plan 6",
      number: 6,
      price: "Custom",
      priceValue: 0,
      tagline: "Fully customized enterprise solution",
      description: "Complete platform customization with dedicated resources, custom development, SLA guarantees, and enterprise-grade support for mission-critical applications.",
      icon: <Rocket className="h-8 w-8" />,
      color: "#6366F1",
      features: [
        "Everything in Plan 5",
        "Fully Customized Platform",
        "Dedicated Development Team",
        "Custom Feature Development",
        "SLA Guarantees",
        "24/7 Priority Support",
        "On-Premise Deployment Option",
        "Custom Training & Onboarding"
      ],
      idealFor: "Large enterprises with mission-critical applications requiring full customization.",
      ctaText: "Contact Sales",
      ctaAction: () => window.location.href = "/contact",
      isHighlighted: false
    }
  ]

  // Handle plan selection - redirect to checkout
  const handlePlanSelect = (planName: string, price: number) => {
    // Store selected plan in sessionStorage for checkout page
    sessionStorage.setItem('selectedPlan', JSON.stringify({
      name: planName,
      price: price,
      billingPeriod: 'monthly'
    }))
    // Redirect to checkout page
    window.location.href = `/checkout?plan=${encodeURIComponent(planName)}&price=${price}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <SimpleHeroSection
        title="Choose Your Platform Plan"
        subtitle="From free exploration to fully customized enterprise solutions — find the perfect plan to build your applications faster."
      />

      {/* Main Content */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-palette-accent-3">
        <div className="container mx-auto px-4 py-16">
          {/* Pricing Plans - Responsive Grid */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Select Your Plan</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                All plans include the complete Admin Rodeo platform foundation. Choose the level of features and support that fits your needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`relative transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
                    plan.isHighlighted 
                      ? "border-2 border-palette-primary shadow-2xl shadow-palette-primary/20 scale-105" 
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {plan.isHighlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-palette-primary text-white px-4 py-1 text-sm font-semibold shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4 flex-shrink-0">
                    <div className="flex justify-center mb-4">
                      <div 
                        className="p-4 rounded-2xl shadow-lg"
                        style={{ backgroundColor: `${plan.color}15`, color: plan.color }}
                      >
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-800 mb-2">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold mb-3" style={{ color: plan.color }}>
                      {plan.price}
                    </div>
                    <div className="text-sm font-medium text-slate-700 italic mb-3 px-4">
                      "{plan.tagline}"
                    </div>
                    <CardDescription className="text-slate-600 text-sm leading-relaxed">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <h4 className="font-semibold mb-4 text-slate-800 flex items-center gap-2">
                        <Check className="h-5 w-5" style={{ color: plan.color }} />
                        Includes:
                      </h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                            <Check className={`h-4 w-4 mt-0.5 flex-shrink-0`} style={{ color: plan.color }} />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-200 mt-auto">
                      <p className="text-sm text-slate-600 mb-4 italic">
                        {plan.idealFor}
                      </p>
                      
                      <Button 
                        onClick={plan.ctaAction}
                        className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ 
                          backgroundColor: plan.color,
                          borderColor: plan.color
                        }}
                      >
                        {plan.ctaText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center bg-gradient-to-r from-palette-accent-3 via-palette-accent-3 to-palette-accent-3 border-2 border-palette-primary/30 rounded-2xl p-10 shadow-xl">
            <div className="mb-6">
              <Badge variant="outline" className="border-palette-primary/30 text-palette-primary bg-white px-4 py-2 mb-4">
                <Rocket className="h-4 w-4 mr-2" />
                Ready to Build Your Application?
              </Badge>
            </div>
            
            <h3 className="text-3xl font-bold mb-4 text-slate-900">Start Building Faster Today</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              All plans include the complete Admin Rodeo platform foundation. Choose a plan and start building your application on top of our proven admin platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-palette-primary to-palette-secondary hover:from-palette-primary-hover hover:to-palette-secondary-hover text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg"
                onClick={() => window.location.href = "/admin"}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Access Admin Panel
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-palette-primary/30 text-palette-primary hover:bg-palette-accent-3 px-8 py-4 text-lg transition-all duration-300"
                onClick={() => window.location.href = "/"}
              >
                <Code className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

