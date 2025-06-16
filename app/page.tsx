'use client'

import { useEffect } from 'react'
import { Header } from '@/components/landing/Header'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { CTASection } from '@/components/landing/CTASection'
import { ContactSection } from '@/components/landing/ContactSection'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  useEffect(() => {
    // Asegurar que la página se muestre desde el inicio
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  )
}
