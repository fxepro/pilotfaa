"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/hero-section"
import { 
  Search, 
  Gauge, 
  TrendingUp, 
  Code, 
  FileText, 
  Network,
  BarChart3,
  CheckCircle,
  Rocket,
  Zap,
  Eye,
  Target
} from "lucide-react"

export default function SEOPage() {
  const features = [
    {
      id: "site-analysis",
      title: "Site Analysis",
      description: "Comprehensive SEO audits with issue detection and actionable recommendations.",
      icon: Search,
      details: [
        "Complete site audits",
        "Issue detection",
        "SEO recommendations",
        "Performance scoring"
      ]
    },
    {
      id: "performance-tracking",
      title: "Performance Tracking",
      description: "Monitor Core Web Vitals, page speed metrics, and mobile optimization scores.",
      icon: Gauge,
      details: [
        "Core Web Vitals",
        "Page speed metrics",
        "Mobile optimization",
        "Performance insights"
      ]
    },
    {
      id: "keyword-monitoring",
      title: "Keyword Monitoring",
      description: "Track keyword rankings, analyze search performance, and monitor competitor insights.",
      icon: TrendingUp,
      details: [
        "Ranking tracking",
        "Keyword analysis",
        "Competitor insights",
        "Search trends"
      ]
    },
    {
      id: "technical-seo",
      title: "Technical SEO",
      description: "Validate sitemaps, check robots.txt, analyze schema markup, and technical issues.",
      icon: Code,
      details: [
        "Sitemap validation",
        "Robots.txt checking",
        "Schema markup analysis",
        "Technical audits"
      ]
    },
    {
      id: "content-analysis",
      title: "Content Analysis",
      description: "Optimize meta tags, analyze heading structure, and assess content quality.",
      icon: FileText,
      details: [
        "Meta tag optimization",
        "Heading structure",
        "Content quality",
        "On-page SEO"
      ]
    },
    {
      id: "link-analysis",
      title: "Link Analysis",
      description: "Analyze internal and external links, detect broken links, and track link quality.",
      icon: Network,
      details: [
        "Internal/external links",
        "Broken link detection",
        "Link quality metrics",
        "Link building insights"
      ]
    }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection
        badge={{
          text: "SEO Monitoring & Optimization",
          icon: Search,
        }}
        title="SEO Monitoring & Optimization"
        description="Track and improve your site's search performance with comprehensive SEO tools"
        primaryAction={{
          text: "Monitor SEO",
          href: "/workspace/seo-monitoring",
          icon: Search,
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
              SEO Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Comprehensive SEO Tools
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to optimize your site for search engines and track performance.
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

      {/* Reporting & Insights */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-palette-primary/30 text-palette-primary">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reporting & Insights
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Actionable SEO Insights
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get comprehensive SEO scorecards, trend analysis, and actionable recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">SEO Scorecards</h3>
                <p className="text-slate-600">Comprehensive scoring and grading for your site's SEO health</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Trend Analysis</h3>
                <p className="text-slate-600">Track SEO performance over time with detailed trend reports</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-slate-200 text-center">
              <CardContent className="pt-6">
                <Eye className="h-12 w-12 text-palette-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Recommendations</h3>
                <p className="text-slate-600">Actionable recommendations to improve your SEO performance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Built Into Your Platform
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              SEO monitoring is integrated directly into your admin platform foundation.
            </p>
          </div>

          <Card className="border-2 border-palette-secondary/30">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Centralized Dashboard</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Access SEO tools from your admin panel</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>No need for separate SEO tools</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Integrated with your existing workflow</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Automated Monitoring</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Continuous SEO monitoring</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Automated alerts and notifications</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Real-time performance tracking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-palette-secondary to-palette-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="border-white/30 text-white bg-white/10 px-4 py-2 mb-6">
            <Search className="h-4 w-4 mr-2" />
            Ready to Optimize?
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Monitoring Your SEO Today
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get access to comprehensive SEO monitoring tools as part of the Admin Rodeo platform foundation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-palette-primary hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
              asChild
            >
              <Link href="/workspace/seo-monitoring">
                <Search className="mr-2 h-5 w-5" />
                Access SEO Tools
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

