'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, FileText, Shield, Users } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glow-multi border-b border-cyan-400/20 bg-black/90 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo with enhanced glow */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="multi-border glow-pulse flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 lg:h-12 lg:w-12">
                <FileText className="text-glow h-5 w-5 text-white lg:h-6 lg:w-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-glow text-lg font-bold text-white lg:text-xl">MTZ</span>
              <span className="text-glow text-xs font-medium text-cyan-400 lg:text-sm">
                Consultores
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with enhanced effects */}
          <nav className="hidden items-center space-x-8 lg:flex">
            <Link
              href="#servicios"
              className="transition-glow shine-effect group relative font-medium text-gray-300 hover:text-cyan-400"
            >
              Servicios
              <span className="glow-multi absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#nosotros"
              className="transition-glow shine-effect group relative font-medium text-gray-300 hover:text-cyan-400"
            >
              Nosotros
              <span className="glow-multi absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#contacto"
              className="transition-glow shine-effect group relative font-medium text-gray-300 hover:text-cyan-400"
            >
              Contacto
              <span className="glow-multi absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* CTA Buttons with futuristic effects */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Link
              href="/auth/login"
              className="transition-glow shine-effect hover-glow rounded-lg border border-cyan-400/60 px-6 py-2.5 font-medium text-cyan-400 backdrop-blur-sm hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/sign-up"
              className="transition-glow multi-border glow-multi shine-effect rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 font-medium text-white hover:from-cyan-400 hover:to-blue-500"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button with glow */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="transition-glow multi-border glow-pulse p-2 text-gray-300 hover:text-cyan-400 lg:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation with enhanced styling */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out lg:hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="circuit-pattern mt-2 space-y-4 rounded-b-xl border-t border-cyan-400/20 bg-black/50 py-4 backdrop-blur-xl">
            <Link
              href="#servicios"
              className="transition-glow shine-effect mx-2 flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-400"
              onClick={() => setIsMenuOpen(false)}
            >
              <Shield className="text-glow h-5 w-5" />
              <span>Servicios</span>
            </Link>
            <Link
              href="#nosotros"
              className="transition-glow shine-effect mx-2 flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-400"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="text-glow h-5 w-5" />
              <span>Nosotros</span>
            </Link>
            <Link
              href="#contacto"
              className="transition-glow shine-effect mx-2 flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-400"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="text-glow h-5 w-5" />
              <span>Contacto</span>
            </Link>

            <div className="space-y-3 border-t border-cyan-400/20 px-2 pt-4">
              <Link
                href="/auth/login"
                className="transition-glow shine-effect block w-full rounded-lg border border-cyan-400/60 px-4 py-3 text-center font-medium text-cyan-400 backdrop-blur-sm hover:bg-cyan-400/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/sign-up"
                className="transition-glow glow-multi shine-effect block w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center font-medium text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 