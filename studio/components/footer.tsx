"use client";
import Link from "next/link"
import { Facebook, Twitter } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-r from-palette-primary to-palette-secondary text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Brand Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Image 
              src="/adminrodeo-Logo-BIG-White.png" 
              alt="Admin Rodeo Logo" 
              width={300} 
              height={72}
              className="object-contain"
            />
          </div>
          <p className="text-white/80 max-w-md leading-relaxed">
            Build any application faster with our complete admin platform foundation. 
            Pre-built admin panel, user management, authentication, and core functionality 
            that gives you a headstart on any project.
          </p>
        </div>

        {/* Connect Section */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <h3 className="font-semibold text-white text-lg">{t('footer.connect')}</h3>
              <div className="flex space-x-4">
                <Link href="https://www.facebook.com/pagerodeo" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="https://www.x.com/pagerodeo" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link href="/features" className="text-white/80 hover:text-white transition-colors font-medium">
                Features
              </Link>
              <Link href="/databases" className="text-white/80 hover:text-white transition-colors font-medium">
                Databases
              </Link>
              <Link href="/api" className="text-white/80 hover:text-white transition-colors font-medium">
                API
              </Link>
              <Link href="/plans" className="text-white/80 hover:text-white transition-colors font-medium">
                Plans
              </Link>
              <Link href="/about" className="text-white/80 hover:text-white transition-colors font-medium">
                {t('footer.about')}
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors font-medium">
                {t('footer.contact')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Policies */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/80">
            © 2026 Admin Rodeo. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-white/80">
            <Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">{t('footer.cookiePolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
