"use client";

import { createClient } from "@/lib/supabase/client";
import { UserService } from "@/lib/services/user.service";
import { CyberButton, CyberInput, CyberCard } from "@/components/ui/cyber-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateRut, formatRut } from "@/lib/utils/rut-validator";
import { Mail, Lock, User, CreditCard, Eye, EyeOff, Sparkles } from "lucide-react";

export function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
    taxId: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Formatear RUT automáticamente
    if (field === 'taxId') {
      value = formatRut(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validaciones
    if (formData.password !== formData.repeatPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.taxId && !validateRut(formData.taxId)) {
      setError("RUT inválido");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        },
      });
      
      if (authError) throw authError;

      // 2. Crear usuario en nuestra tabla users
      if (authData.user) {
        await UserService.createUserAfterSignUp(authData.user.id, {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          taxId: formData.taxId || undefined
        });
      }
      
      toast.success("Cuenta creada exitosamente. Por favor verifica tu email.");
      router.push("/auth/login");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al crear cuenta";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-8">
      {/* Background effects */}
      <div className="circuit-pattern absolute inset-0 opacity-20" />
      
      {/* Floating orbs */}
      <div className="float-gentle absolute left-20 top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div
        className="float-gentle absolute bottom-20 right-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 w-full max-w-lg mx-4">
        <CyberCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="glow-pulse mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-glow-intense bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
              Crear Cuenta
            </h1>
            <p className="mt-2 text-gray-400">
              Únete a MTZ Consultores Tributarios
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <CyberInput
                label="Nombre"
                type="text"
                placeholder="Juan"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                icon={<User className="h-4 w-4" />}
                required
              />
              <CyberInput
                label="Apellido"
                type="text"
                placeholder="Pérez"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                icon={<User className="h-4 w-4" />}
                required
              />
            </div>

            {/* RUT */}
            <CyberInput
              label="RUT (Opcional)"
              type="text"
              placeholder="12.345.678-9"
              value={formData.taxId}
              onChange={handleChange('taxId')}
              icon={<CreditCard className="h-4 w-4" />}
              maxLength={12}
            />

            {/* Email */}
            <CyberInput
              label="Correo Electrónico"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange('email')}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            {/* Contraseña */}
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
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange('password')}
                  required
                  minLength={6}
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

            {/* Confirmar Contraseña */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={formData.repeatPassword}
                  onChange={handleChange('repeatPassword')}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              variant="success"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creando cuenta...
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </CyberButton>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="text-glow h-1 w-8 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              <Sparkles className="text-glow h-3 w-3 text-purple-400" />
              <div className="text-glow h-1 w-8 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
            </div>
          </div>
        </CyberCard>
      </div>
    </div>
  );
}
