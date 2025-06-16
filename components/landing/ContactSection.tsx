'use client'

import { Mail, Phone, MapPin, Calendar, Clock, CheckCircle, Shield } from 'lucide-react'

export function ContactSection() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Teléfono',
      value: '+56 9 1234 5678',
      description: 'Línea directa disponible',
      gradient: 'from-cyan-400 to-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'contacto@mtzconsultores.com',
      description: 'Respuesta en 24 horas',
      gradient: 'from-blue-400 to-cyan-600'
    },
    {
      icon: MapPin,
      title: 'Oficina',
      value: 'Av. Principal 123, Santiago',
      description: 'Citas presenciales',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ]

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-20 lg:py-32"
    >
      {/* Background effects */}
      <div className="circuit-pattern absolute inset-0 opacity-20" />

      {/* Floating elements */}
      <div className="float-gentle absolute right-20 top-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-2xl" />
      <div
        className="float-gentle absolute bottom-20 left-20 h-48 w-48 rounded-full bg-blue-500/5 blur-2xl"
        style={{ animationDelay: '1.5s' }}
      />

      <div className="container relative mx-auto px-4 lg:px-6">
        {/* Section header */}
        <div className="mb-16 text-center lg:mb-20">
          <div className="glow-multi mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-2 backdrop-blur-sm">
            <div className="text-glow h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-glow text-sm font-medium text-cyan-400">Contáctanos</span>
          </div>

          <h2 className="text-glow mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Hablemos de tu
            <span className="text-glow-intense block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              futuro fiscal
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-400 lg:text-xl">
            Estamos aquí para resolver todas tus dudas tributarias y diseñar la estrategia perfecta
            para tu situación específica.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact methods */}
          <div className="space-y-6">
            <h3 className="text-glow mb-8 text-2xl font-bold text-white">
              Múltiples formas de contactarnos
            </h3>

            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <div
                  key={index}
                  className="shine-effect hover-glow group flex items-start gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50"
                >
                  <div
                    className={`h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${method.gradient} glow-pulse float-gentle flex items-center justify-center`}
                  >
                    <Icon className="text-glow h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-glow mb-1 text-lg font-semibold text-white">
                      {method.title}
                    </h4>
                    <p className="text-glow mb-1 font-medium text-cyan-400">{method.value}</p>
                    <p className="text-sm text-gray-400">{method.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Schedule section */}
          <div className="space-y-6">
            <h3 className="text-glow mb-8 text-2xl font-bold text-white">Agenda tu Consulta</h3>

            {/* Calendar card */}
            <div className="multi-border glow-multi rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="glow-pulse float-gentle flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
                  <Calendar className="text-glow h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-glow mb-2 text-xl font-bold text-white">Consulta Gratuita</h4>
                  <p className="text-glow text-sm font-medium text-cyan-400">
                    30 minutos • Sin compromiso
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="transition-glow flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-800/50 p-3 hover:border-cyan-400/30">
                  <Clock className="text-glow h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Lunes a Viernes: 9:00 - 18:00</span>
                </div>

                <div className="transition-glow flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-800/50 p-3 hover:border-cyan-400/30">
                  <CheckCircle className="text-glow h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Respuesta garantizada en 24h</span>
                </div>
              </div>

              <button className="transition-glow shine-effect glow-multi w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 font-bold text-white hover:from-cyan-400 hover:to-blue-500">
                Reservar Consulta Gratuita
              </button>
            </div>

            {/* Response guarantee badge */}
            <div className="glow-multi rounded-2xl border border-green-400/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="glow-pulse flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-600">
                  <Shield className="text-glow h-5 w-5 text-white" />
                </div>
                <h4 className="text-glow text-lg font-bold text-white">Garantía de Respuesta</h4>
              </div>
              <p className="text-sm leading-relaxed text-gray-300">
                Te garantizamos una respuesta en menos de 2 horas durante horario laboral, o tu
                primera consulta será completamente gratuita.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-16 flex justify-center lg:mt-20">
          <div className="flex items-center gap-4">
            <div className="text-glow h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
            <div
              className="text-glow h-2 w-2 animate-pulse rounded-full bg-blue-400"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="text-glow h-4 w-4 animate-pulse rounded-full bg-purple-400"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="text-glow h-2 w-2 animate-pulse rounded-full bg-cyan-400"
              style={{ animationDelay: '1.5s' }}
            />
            <div
              className="text-glow h-3 w-3 animate-pulse rounded-full bg-blue-400"
              style={{ animationDelay: '2s' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
} 