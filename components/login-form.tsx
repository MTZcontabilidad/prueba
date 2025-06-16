"use client";

import { createClient } from "@/lib/supabase/client";
import { UserService } from "@/lib/services/user.service";
import { CyberButton, CyberInput, CyberCard } from "@/components/ui/cyber-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // Verificar si el usuario está bloqueado
      const isLocked = await UserService.isUserLocked(email);
      if (isLocked) {
        throw new Error("Cuenta bloqueada temporalmente. Intente más tarde.");
      }

      // Intentar login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Manejar intento fallido
        await UserService.handleFailedLogin(email);
        throw error;
      }
      
      // Login exitoso - resetear intentos fallidos y actualizar último acceso
      if (data.user) {
        await UserService.resetFailedAttempts(email);
        await UserService.updateLastLogin(data.user.id);
      }
      
      toast.success("Inicio de sesión exitoso");
      router.push("/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="circuit-pattern absolute inset-0 opacity-20" />
      
      {/* Floating orbs */}
      <div className="float-gentle absolute left-20 top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div
        className="float-gentle absolute bottom-20 right-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        <CyberCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="glow-pulse mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-glow-intense bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
              Iniciar Sesión
            </h1>
            <p className="mt-2 text-gray-400">
              Accede a tu cuenta de MTZ Consultores
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <CyberInput
              label="Correo Electrónico"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="glow-multi rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <CyberButton
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </CyberButton>

            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/auth/sign-up"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="text-glow h-1 w-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <Sparkles className="text-glow h-3 w-3 text-cyan-400" />
              <div className="text-glow h-1 w-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </div>
          </div>
        </CyberCard>
      </div>
    </div>
  );
}
