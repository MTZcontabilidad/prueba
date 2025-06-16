import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Clock, Users } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-20 lg:py-32">
      {/* Animated background */}
      <div className="pattern-move absolute inset-0 opacity-40" />

      {/* Floating orbs with enhanced effects */}
      <div className="glow-pulse absolute left-10 top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="float-gentle absolute bottom-10 right-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div
        className="glow-pulse absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-500/5 blur-3xl"
        style={{ animationDelay: '2s' }}
      />

      <div className="container relative mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Main CTA Card without spinning border */}
          <div className="multi-border glow-multi relative rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 text-center backdrop-blur-xl lg:p-12">
            {/* Badge with enhanced styling */}
            <div className="glow-multi float-gentle mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2">
              <Sparkles className="text-glow h-4 w-4 text-cyan-400" />
              <span className="text-glow text-sm font-semibold text-cyan-400">Únete hoy</span>
            </div>

            {/* Main heading with intense glow */}
            <h2 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              <span className="text-glow">Comienza tu</span>
              <span className="text-glow-intense block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                transformación fiscal
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 lg:text-xl">
              Únete a cientos de empresas que ya confían en MTZ Consultores para su gestión
              tributaria. Tu tranquilidad fiscal está a un clic de distancia.
            </p>

            {/* CTA Buttons with enhanced effects */}
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:gap-6">
              <Link
                href="/auth/sign-up"
                className="transition-glow multi-border shine-effect glow-intense group relative inline-flex w-full min-w-[250px] transform items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-4 font-bold text-white hover:scale-105 hover:from-cyan-400 hover:to-blue-500 sm:w-auto lg:px-12 lg:py-5"
              >
                <span className="relative z-10 flex items-center text-lg">
                  Crear Cuenta Gratis
                  <ArrowRight
                    className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
                    size={22}
                  />
                </span>
              </Link>

              <Link
                href="#contacto"
                className="transition-glow hover-glow shine-effect group inline-flex w-full min-w-[250px] items-center justify-center rounded-xl border-2 border-cyan-400/60 bg-transparent px-10 py-4 font-bold text-cyan-400 backdrop-blur-sm hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white sm:w-auto lg:px-12 lg:py-5"
              >
                <span className="text-lg">Solicitar Demo</span>
              </Link>
            </div>

            {/* Trust indicators with floating effect */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 lg:gap-8">
              <div className="float-gentle flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-2 backdrop-blur-sm">
                <div className="glow-pulse flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
                  <Shield className="text-glow h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300">Garantía Total</span>
              </div>

              <div
                className="float-gentle flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-2 backdrop-blur-sm"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="glow-pulse flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-600">
                  <Clock className="text-glow h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300">Respuesta 24h</span>
              </div>

              <div
                className="float-gentle flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-2 backdrop-blur-sm"
                style={{ animationDelay: '1s' }}
              >
                <div className="glow-pulse flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Users className="text-glow h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300">+500 Clientes</span>
              </div>
            </div>
          </div>

          {/* Floating decorative elements */}
          <div className="glow-multi float-gentle absolute -left-6 -top-6 h-12 w-12 rounded-full border-2 border-cyan-400/30" />
          <div
            className="glow-multi float-gentle absolute -right-8 -top-4 h-8 w-8 rounded-full border-2 border-blue-400/30"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="glow-multi float-gentle absolute -bottom-8 -left-4 h-10 w-10 rounded-full border-2 border-purple-400/30"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="glow-multi float-gentle absolute -bottom-6 -right-6 h-14 w-14 rounded-full border-2 border-cyan-400/30"
            style={{ animationDelay: '0.5s' }}
          />
        </div>
      </div>
    </section>
  )
} 