import { Heart, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative border-t border-gray-800/50 bg-black/80 py-12 backdrop-blur-xl lg:py-16">
      {/* Top accent line */}
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          {/* Copyright */}
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-400 lg:text-base">
              © 2025 MTZ Consultores Tributarios
            </p>
            <p className="mt-1 text-xs text-gray-500 lg:text-sm">Todos los derechos reservados</p>
          </div>

          {/* Developed by */}
          <div className="flex items-center gap-2 text-center lg:text-right">
            <Sparkles className="h-4 w-4 animate-pulse text-cyan-400" />
            <p className="text-sm text-gray-400 lg:text-base">
              Plataforma desarrollada con
              <Heart
                className="mx-2 inline-block animate-pulse text-cyan-400"
                size={16}
                fill="currentColor"
              />
              por
            </p>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-sm font-semibold text-transparent lg:text-base">
              MTZ Ouroborus AI 3.0
            </span>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-8 border-t border-gray-800/30 pt-6">
          <div className="flex items-center justify-center gap-4 opacity-30">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <div
              className="h-1 w-1 animate-pulse rounded-full bg-blue-400"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400"
              style={{ animationDelay: '1s' }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
} 