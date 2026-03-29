"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/hero-section"
import { 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  CircleDollarSign,
  CheckCircle,
  Rocket,
  Zap,
  Shield,
  FileText,
  BarChart3
} from "lucide-react"

export default function FinancialsPage() {
  const features = [
    {
      id: "subscription-management",
      title: "Subscription Management",
      description: "Manage multiple subscription plans with easy upgrade, downgrade, and billing history tracking.",
      icon: CreditCard,
      details: [
        "Multiple plan tiers",
        "Upgrade/downgrade flows",
        "Billing history",
        "Subscription status tracking"
      ]
    },
    {
      id: "payment-processing",
      title: "Payment Processing",
      description: "Secure payment processing with multiple gateways, transaction management, and invoice generation.",
      icon: Receipt,
      details: [
        "Multiple payment gateways",
        "Secure transactions",
        "Invoice generation",
        "Payment history"
      ]
    },
    {
      id: "financial-reporting",
      title: "Financial Reporting",
      description: "Track revenue, analyze transactions, and generate comprehensive financial reports.",
      icon: TrendingUp,
      details: [
        "Revenue tracking",
        "Transaction logs",
        "Financial analytics",
        "Custom reports"
      ]
    },
    {
      id: "multi-currency",
      title: "Multi-Currency Support",
      description: "Support multiple currencies with automatic conversion, localized pricing, and exchange rate management.",
      icon: CircleDollarSign,
      details: [
        "Currency conversion",
        "Localized pricing",
        "Exchange rate updates",
        "Multi-currency transactions"
      ]
    }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection
        badge={{
          text: "Financial Management",
          icon: CreditCard,
        }}
        title="Flexible Pricing & Billing"
        description="Complete financial management with subscription billing, payment processing, and multi-currency support"
        primaryAction={{
          text: "View Pricing",
          href: "/courses",
          icon: CreditCard,
        }}
        secondaryAction={{
          text: "View All Features",
          href: "/features",
          icon: Rocket,
        }}
        // gradientVia="via-palette-accent-2"
      />

      {/* Features Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-accent-2/30 text-palette-accent-2">
              <Zap className="h-4 w-4 mr-2" />
              Financial Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Complete Financial Management
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to manage subscriptions, process payments, and track finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.id} className="border-2 border-slate-200 hover:border-palette-accent-2/50 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-palette-accent-2/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-palette-accent-2" />
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

      {/* Pricing Overview */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-primary/30 text-palette-primary">
              <BarChart3 className="h-4 w-4 mr-2" />
              Pricing Tiers
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Flexible Pricing for Every Stage
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From free tier to enterprise solutions, choose the plan that fits your needs.
            </p>
          </div>

          <Card className="border-2 border-palette-primary/30">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <p className="text-lg text-slate-600 mb-4">
                  Admin Rodeo offers flexible pricing plans to suit businesses of all sizes.
                </p>
                <Button size="lg" className="bg-palette-primary hover:bg-palette-primary-hover text-white" asChild>
                  <Link href="/courses">
                    <CreditCard className="mr-2 h-5 w-5" />
                    View All Plans
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-secondary/30 text-palette-secondary">
              <Shield className="h-4 w-4 mr-2" />
              Enterprise Solutions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Custom Solutions for Enterprise
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Need something more? We offer custom pricing and dedicated support for enterprise customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Pricing</h3>
                <p className="text-slate-600">Tailored pricing based on your specific needs and usage</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Dedicated Support</h3>
                <p className="text-slate-600">Priority support with dedicated account management</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">SLA Guarantees</h3>
                <p className="text-slate-600">Service level agreements with uptime guarantees</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-palette-accent-2 to-palette-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="border-white/30 text-white bg-white/10 px-4 py-2 mb-6">
            <CreditCard className="h-4 w-4 mr-2" />
            Ready to Get Started?
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Plan Today
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get access to the complete Admin Rodeo platform foundation with flexible pricing options.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-palette-primary hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
              asChild
            >
              <Link href="/courses">
                <CreditCard className="mr-2 h-5 w-5" />
                View Plans
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

