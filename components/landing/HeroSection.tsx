import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Users, Clock } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="pattern-move relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Floating orbs with new effects */}
      <div className="glow-pulse absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div
        className="float-gentle absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="glow-pulse absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-500/5 blur-3xl"
        style={{ animationDelay: '1.5s' }}
      />

      <div className="container relative mx-auto px-4 py-20 text-center lg:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Decorative line with enhanced effects */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="glow-multi h-[1px] w-16 bg-gradient-to-r from-transparent to-cyan-400 lg:w-32" />
            <div className="flex gap-2">
              <Sparkles className="float-gentle text-glow h-4 w-4 text-cyan-400" />
              <Sparkles
                className="float-gentle text-glow h-4 w-4 text-blue-400"
                style={{ animationDelay: '0.5s' }}
              />
              <Sparkles
                className="float-gentle text-glow h-4 w-4 text-cyan-400"
                style={{ animationDelay: '1s' }}
              />
            </div>
            <div className="glow-multi h-[1px] w-16 bg-gradient-to-l from-transparent to-cyan-400 lg:w-32" />
          </div>

          {/* Main heading with glow effects */}
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            <span className="text-glow mb-2 block text-white">MTZ Consultores</span>
            <span className="text-glow-intense block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tributarios
            </span>
          </h1>

          {/* Subtitle with enhanced styling */}
          <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-gray-300 sm:text-2xl lg:text-3xl">
            Deja tu empresa en
            <span className="text-glow bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-medium text-transparent">
              {' '}
              manos expertas
            </span>
          </p>

          {/* Description */}
          <p className="mx-auto mb-12 max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg lg:text-xl">
            Navega el complejo mundo tributario con profesionales a tu lado. Ofrecemos soluciones
            personalizadas, acceso seguro a tu documentación y la tranquilidad fiscal que necesitas.
          </p>

          {/* CTA Buttons with futuristic effects */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:gap-6">
            <Link
              href="/auth/login"
              className="transition-glow multi-border shine-effect glow-multi group relative inline-flex w-full min-w-[200px] transform items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white hover:scale-105 hover:from-cyan-400 hover:to-blue-500 sm:w-auto lg:px-10 lg:py-5"
            >
              <span className="relative z-10 flex items-center text-lg">
                Acceder al Portal
                <ArrowRight
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  size={20}
                />
              </span>
            </Link>

            <Link
              href="#contacto"
              className="transition-glow hover-glow shine-effect group inline-flex w-full min-w-[200px] items-center justify-center rounded-xl border-2 border-cyan-400/60 bg-transparent px-8 py-4 font-semibold text-cyan-400 backdrop-blur-sm hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white sm:w-auto lg:px-10 lg:py-5"
            >
              <span className="text-lg">Contáctanos</span>
            </Link>
          </div>

          {/* Trust indicators with enhanced styling */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 lg:mt-16 lg:gap-8">
            <div className="float-gentle glow-multi flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3 backdrop-blur-sm">
              <div className="glow-pulse flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
                <Shield className="text-glow h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-glow font-semibold text-white">100% Seguro</div>
                <div className="text-xs text-gray-400">Encriptación bancaria</div>
              </div>
            </div>

            <div
              className="float-gentle glow-multi flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3 backdrop-blur-sm"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="glow-pulse flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600">
                <Users className="text-glow h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-glow font-semibold text-white">+500 Clientes</div>
                <div className="text-xs text-gray-400">Confianza comprobada</div>
              </div>
            </div>

            <div
              className="float-gentle glow-multi flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 px-4 py-3 backdrop-blur-sm"
              style={{ animationDelay: '1s' }}
            >
              <div className="glow-pulse flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                <Clock className="text-glow h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-glow font-semibold text-white">24/7 Soporte</div>
                <div className="text-xs text-gray-400">Siempre disponible</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with glow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
        <div className="glow-multi flex h-10 w-6 justify-center rounded-full border-2 border-cyan-400/60">
          <div className="text-glow mt-2 h-3 w-1 animate-bounce rounded-full bg-cyan-400" />
        </div>
      </div>
    </section>
  )
} 