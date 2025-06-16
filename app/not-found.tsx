'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Home, ArrowLeft, Sparkles } from 'lucide-react'

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <style jsx global>{`
        @keyframes glitch {
          0%,
          100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          20% {
            transform: translate(-2px, 2px);
            filter: hue-rotate(90deg);
          }
          40% {
            transform: translate(-2px, -2px);
            filter: hue-rotate(180deg);
          }
          60% {
            transform: translate(2px, 2px);
            filter: hue-rotate(270deg);
          }
          80% {
            transform: translate(2px, -2px);
            filter: hue-rotate(360deg);
          }
        }

        @keyframes flicker {
          0%,
          100% {
            opacity: 1;
          }
          10% {
            opacity: 0.8;
          }
          20% {
            opacity: 1;
          }
          30% {
            opacity: 0.9;
          }
          40% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          60% {
            opacity: 1;
          }
        }

        @keyframes dataStream {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        .glitch-text {
          position: relative;
          animation: flicker 4s ease-in-out infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text::before {
          animation: glitch 2s ease-in-out infinite;
          color: #00ffff;
          z-index: -1;
          opacity: 0.8;
        }

        .glitch-text::after {
          animation: glitch 2s ease-in-out infinite reverse;
          color: #ff00ff;
          z-index: -2;
          opacity: 0.8;
        }

        .data-line {
          position: absolute;
          width: 2px;
          height: 100px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 255, 255, 0.8) 50%,
            transparent 100%
          );
          animation: dataStream 4s linear infinite;
        }
      `}</style>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Enhanced background effects */}
        <div className="circuit-pattern absolute inset-0 opacity-20" />

        {/* Data streams */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="data-line"
              style={{
                left: `${12.5 * i + 6}%`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.3
              }}
            />
          ))}
        </div>

        {/* Floating orbs with parallax */}
        <div
          className="float-gentle absolute h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
          style={{
            top: '20%',
            left: `${10 + mousePosition.x * 0.1}%`,
            transform: `translateY(${mousePosition.y * 0.1}px)`
          }}
        />
        <div
          className="float-gentle absolute h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
          style={{
            bottom: '20%',
            right: `${10 + mousePosition.x * 0.05}%`,
            transform: `translateY(${mousePosition.y * 0.05}px)`,
            animationDelay: '3s'
          }}
        />

        <div className="relative z-10 px-4 text-center">
          {/* 404 Error Code */}
          <div className="relative mb-8">
            <h1
              className="glitch-text text-glow-intense text-[10rem] font-bold leading-none text-cyan-400 md:text-[15rem]"
              data-text="404"
            >
              404
            </h1>
            {/* Rotating rings around 404 */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="rotate-slow glow-multi absolute h-[300px] w-[300px] rounded-full border-2 border-cyan-500/20 md:h-[500px] md:w-[500px]"></div>
              <div
                className="rotate-slow absolute h-[250px] w-[250px] rounded-full border-2 border-purple-500/20 md:h-[450px] md:w-[450px]"
                style={{ animationDirection: 'reverse' }}
              ></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <p className="text-glow mb-4 text-2xl font-semibold text-white md:text-3xl">
              <span className="text-red-400">ERROR:</span> Página no encontrada
            </p>
            <p className="mx-auto max-w-md text-lg text-gray-400">
              Parece que te has perdido en el ciberespacio. La página que buscas no existe en esta
              dimensión.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="transition-glow multi-border shine-effect glow-multi group inline-flex w-full min-w-[200px] transform items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white hover:scale-105 hover:from-cyan-400 hover:to-blue-500 sm:w-auto"
            >
              <Home className="mr-2 h-5 w-5" />
              Volver al Inicio
            </Link>

            <button
              onClick={() => window.history.back()}
              className="transition-glow hover-glow shine-effect group inline-flex w-full min-w-[200px] items-center justify-center rounded-xl border-2 border-cyan-400/60 bg-transparent px-8 py-4 font-semibold text-cyan-400 backdrop-blur-sm hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Página Anterior
            </button>
          </div>

          {/* System Status */}
          <div className="mt-12">
            <div className="glow-multi inline-flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 px-6 py-3 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="text-glow h-2 w-2 animate-pulse rounded-full bg-green-400" />
                <div
                  className="text-glow h-2 w-2 animate-pulse rounded-full bg-cyan-400"
                  style={{ animationDelay: '0.5s' }}
                />
                <div
                  className="text-glow h-2 w-2 animate-pulse rounded-full bg-blue-400"
                  style={{ animationDelay: '1s' }}
                />
              </div>
              <span className="text-sm font-medium text-gray-300">
                Sistema operativo • Todos los servicios funcionando
              </span>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-4">
              <Sparkles className="text-glow h-4 w-4 animate-pulse text-cyan-400" />
              <div className="text-glow h-1 w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <Sparkles className="text-glow h-4 w-4 animate-pulse text-blue-400" style={{ animationDelay: '1s' }} />
              <div className="text-glow h-1 w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              <Sparkles className="text-glow h-4 w-4 animate-pulse text-purple-400" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 