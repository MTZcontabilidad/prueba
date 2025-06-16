import { Shield, FileText, Clock, Users, TrendingUp, Lock } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Seguridad Garantizada',
    subtitle: 'Protección Total',
    description:
      'Tus documentos están protegidos con encriptación de nivel bancario y acceso controlado.',
    gradient: 'from-cyan-400 to-blue-600'
  },
  {
    icon: FileText,
    title: 'Gestión Documental',
    subtitle: 'Organización Inteligente',
    description:
      'Organiza, clasifica y accede a todos tus documentos tributarios desde cualquier lugar.',
    gradient: 'from-blue-400 to-cyan-600'
  },
  {
    icon: Clock,
    title: 'Respuesta Inmediata',
    subtitle: 'Soporte 24/7',
    description: 'Nuestro equipo de expertos está disponible cuando lo necesites, sin demoras.',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Users,
    title: 'Equipo Especializado',
    subtitle: 'Profesionales Certificados',
    description: 'Contadores y asesores tributarios con años de experiencia en el mercado.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: TrendingUp,
    title: 'Optimización Fiscal',
    subtitle: 'Máximo Ahorro',
    description: 'Estrategias personalizadas para optimizar tu carga tributaria de forma legal.',
    gradient: 'from-cyan-400 to-blue-600'
  },
  {
    icon: Lock,
    title: 'Cumplimiento Total',
    subtitle: 'Cero Riesgos',
    description: 'Garantizamos el cumplimiento de todas las obligaciones tributarias y normativas.',
    gradient: 'from-blue-400 to-cyan-600'
  }
]

export function FeaturesSection() {
  return (
    <section
      id="servicios"
      className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-20 lg:py-32"
    >
      {/* Background pattern */}
      <div className="circuit-pattern absolute inset-0 opacity-30" />

      {/* Floating elements */}
      <div className="float-gentle absolute left-10 top-20 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl" />
      <div
        className="float-gentle absolute bottom-20 right-10 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl"
        style={{ animationDelay: '2s' }}
      />

      <div className="container relative mx-auto px-4 lg:px-6">
        {/* Section header with enhanced styling */}
        <div className="mb-16 text-center lg:mb-20">
          <div className="glow-multi mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-2 backdrop-blur-sm">
            <div className="text-glow h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-glow text-sm font-medium text-cyan-400">Nuestros Servicios</span>
          </div>

          <h2 className="text-glow mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Soluciones
            <span className="text-glow-intense bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {' '}
              Tributarias
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-400 lg:text-xl">
            Ofrecemos un conjunto completo de servicios diseñados para simplificar tu gestión
            tributaria y maximizar tu tranquilidad fiscal.
          </p>
        </div>

        {/* Features grid with enhanced effects */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="multi-border shine-effect hover-glow group relative rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-cyan-400/50 hover:bg-gray-800/50 lg:p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-400/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Icon with enhanced glow */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br lg:h-16 lg:w-16 ${feature.gradient} glow-pulse float-gentle`}
                  >
                    <Icon className="text-glow h-7 w-7 text-white lg:h-8 lg:w-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-3">
                    <h3 className="text-glow mb-1 text-xl font-bold text-white lg:text-2xl">
                      {feature.title}
                    </h3>
                    <p className="text-glow text-sm font-medium text-cyan-400">
                      {feature.subtitle}
                    </p>
                  </div>

                  <p className="leading-relaxed text-gray-400">{feature.description}</p>
                </div>

                {/* Hover indicator */}
                <div className="glow-intense absolute bottom-4 right-4 h-2 w-2 rounded-full bg-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-100" />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA with futuristic styling */}
        <div className="mt-16 text-center lg:mt-20">
          <div className="multi-border glow-multi inline-flex items-center gap-4 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 px-8 py-4 backdrop-blur-sm">
            <div className="flex gap-2">
              <div className="text-glow h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              <div
                className="text-glow h-2 w-2 animate-pulse rounded-full bg-blue-400"
                style={{ animationDelay: '0.5s' }}
              />
              <div
                className="text-glow h-2 w-2 animate-pulse rounded-full bg-purple-400"
                style={{ animationDelay: '1s' }}
              />
            </div>
            <span className="font-medium text-gray-300">
              ¿Necesitas una solución personalizada?
            </span>
            <button className="transition-glow shine-effect glow-multi rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-medium text-white hover:from-cyan-400 hover:to-blue-500">
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 