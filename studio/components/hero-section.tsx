"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

export interface HeroSectionProps {
  /** Badge text displayed above the title */
  badge?: {
    text: string
    icon?: LucideIcon
  }
  /** Main heading text */
  title: string
  /** Subtitle/description text */
  description: string
  /** Primary CTA button */
  primaryAction?: {
    text: string
    href: string
    icon?: LucideIcon
  }
  /** Secondary CTA button */
  secondaryAction?: {
    text: string
    href: string
    icon?: LucideIcon
  }
  /** Custom gradient background colors (default: slate-900 via palette-primary to slate-900) */
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
}

export function HeroSection({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  gradientFrom = "from-slate-900",
  gradientVia = "via-palette-primary",
  gradientTo = "to-slate-900",
}: HeroSectionProps) {
  const BadgeIcon = badge?.icon
  const PrimaryIcon = primaryAction?.icon
  const SecondaryIcon = secondaryAction?.icon

  // Map gradient colors to corresponding color classes for badges and buttons
  // This ensures consistent theming across all elements
  const getColorClasses = (viaColor: string) => {
    const colorMap: Record<string, {
      blob: string
      badgeBorder: string
      badgeBg: string
      button: string
      buttonHover: string
    }> = {
      "via-palette-primary": {
        blob: "bg-palette-primary",
        badgeBorder: "border-palette-primary/40",
        badgeBg: "bg-palette-primary/15",
        button: "bg-palette-primary",
        buttonHover: "hover:bg-palette-primary-hover",
      },
      "via-palette-accent-1": {
        blob: "bg-palette-accent-1",
        badgeBorder: "border-palette-accent-1/40",
        badgeBg: "bg-palette-accent-1/15",
        button: "bg-palette-accent-1",
        buttonHover: "hover:bg-palette-accent-1/90",
      },
      "via-palette-accent-2": {
        blob: "bg-palette-accent-2",
        badgeBorder: "border-palette-accent-2/40",
        badgeBg: "bg-palette-accent-2/15",
        button: "bg-palette-accent-2",
        buttonHover: "hover:bg-palette-accent-2/90",
      },
      "via-palette-accent-3": {
        blob: "bg-palette-accent-3",
        badgeBorder: "border-palette-accent-3/40",
        badgeBg: "bg-palette-accent-3/15",
        button: "bg-palette-accent-3",
        buttonHover: "hover:bg-palette-accent-3/90",
      },
      "via-palette-secondary": {
        blob: "bg-palette-secondary",
        badgeBorder: "border-palette-secondary/40",
        badgeBg: "bg-palette-secondary/15",
        button: "bg-palette-secondary",
        buttonHover: "hover:bg-palette-secondary-hover",
      },
    }

    return colorMap[viaColor] || colorMap["via-palette-primary"]
  }

  const colors = getColorClasses(gradientVia)

  return (
    <section className={`relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse ${colors.blob}`}></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-2000 bg-palette-accent-1"></div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        {badge && (
          <Badge 
            variant="outline" 
            className={`${colors.badgeBorder} text-white/80 ${colors.badgeBg} backdrop-blur-sm px-6 py-2 text-sm font-medium mb-6`}
          >
            {BadgeIcon && <BadgeIcon className="h-4 w-4 mr-2" />}
            {badge.text}
          </Badge>
        )}
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        
        <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
          {description}
        </p>
        
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {primaryAction && (
              <Button 
                size="lg" 
                className={`${colors.button} ${colors.buttonHover} text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl`}
                asChild
              >
                <Link href={primaryAction.href}>
                  {PrimaryIcon && <PrimaryIcon className="mr-2 h-5 w-5" />}
                  {primaryAction.text}
                </Link>
              </Button>
            )}
            {secondaryAction && (
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-8 py-6 text-lg rounded-xl backdrop-blur-sm font-semibold" 
                asChild
              >
                <Link href={secondaryAction.href}>
                  {SecondaryIcon && <SecondaryIcon className="mr-2 h-5 w-5" />}
                  {secondaryAction.text}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
