"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, Users, FileText, Activity, Bell, Settings, LogOut, Sparkles, Plus, Eye, Download, Upload, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.push('/auth/login');
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error('Error obteniendo usuario:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="glow-pulse mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
            <Sparkles className="h-6 w-6 animate-spin text-white" />
          </div>
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="circuit-pattern absolute inset-0 opacity-20" />

      {/* Floating orbs */}
      <div className="float-gentle absolute left-20 top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div
        className="float-gentle absolute bottom-20 right-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="float-gentle absolute left-10 top-1/2 h-32 w-32 rounded-full bg-purple-500/5 blur-2xl"
        style={{ animationDelay: '4s' }}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-glow-intense bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-400">Bienvenido, {user?.email || 'Usuario'}</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="glow-multi rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-gray-300 transition-all duration-300 hover:text-cyan-400">
              <Bell className="h-5 w-5" />
            </button>
            <button className="glow-multi rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-gray-300 transition-all duration-300 hover:text-cyan-400">
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="shine-effect glow-multi rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white transition-all duration-300 hover:from-red-400 hover:to-red-500"
            >
              <LogOut className="mr-2 inline h-4 w-4" />
              Salir
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Clientes</p>
                <p className="text-glow text-2xl font-bold text-white">24</p>
              </div>
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Documentos</p>
                <p className="text-glow text-2xl font-bold text-white">156</p>
              </div>
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Reportes</p>
                <p className="text-glow text-2xl font-bold text-white">12</p>
              </div>
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Crecimiento</p>
                <p className="text-glow text-2xl font-bold text-white">+15%</p>
              </div>
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-cyan-600">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="text-glow mb-4 flex items-center gap-2 text-xl font-semibold text-white">
              <Activity className="h-5 w-5 text-cyan-400" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {[
                { action: 'Cliente agregado: Empresa ABC', time: 'Hace 2 horas', type: 'client' },
                { action: 'Documento subido: Factura #001', time: 'Hace 4 horas', type: 'upload' },
                { action: 'Reporte generado: Mensual', time: 'Hace 6 horas', type: 'report' },
                { action: 'Cliente actualizado: XYZ Corp', time: 'Hace 1 día', type: 'update' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-800/30 p-3"
                >
                  <div className="glow-pulse flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{item.action}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="text-glow mb-4 flex items-center gap-2 text-xl font-semibold text-white">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  title: 'Nuevo Cliente', 
                  icon: Plus, 
                  color: 'from-cyan-500 to-blue-600',
                  href: '/clients'
                },
                { 
                  title: 'Ver Clientes', 
                  icon: Eye, 
                  color: 'from-blue-500 to-purple-600',
                  href: '/clients'
                },
                { 
                  title: 'Subir Archivo', 
                  icon: Upload, 
                  color: 'from-purple-500 to-pink-600',
                  href: '/clients'
                },
                { 
                  title: 'Generar Reporte', 
                  icon: Download, 
                  color: 'from-green-500 to-cyan-600',
                  href: '/reports'
                }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className={`shine-effect glow-multi group flex flex-col items-center gap-2 rounded-lg bg-gradient-to-r ${action.color} p-4 text-white transition-all duration-300 hover:scale-105`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <button
            onClick={() => router.push('/clients')}
            className="multi-border shine-effect glow-multi group rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 text-left backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50"
          >
            <div className="flex items-center gap-4">
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-glow text-lg font-semibold text-white">Gestión de Clientes</h4>
                <p className="text-sm text-gray-400">Administra tu cartera de clientes</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/reports')}
            className="multi-border shine-effect glow-multi group rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 text-left backdrop-blur-xl transition-all duration-300 hover:border-purple-400/50"
          >
            <div className="flex items-center gap-4">
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-glow text-lg font-semibold text-white">Reportes</h4>
                <p className="text-sm text-gray-400">Genera reportes detallados</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="multi-border shine-effect glow-multi group rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 text-left backdrop-blur-xl transition-all duration-300 hover:border-green-400/50"
          >
            <div className="flex items-center gap-4">
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-cyan-600">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-glow text-lg font-semibold text-white">Mi Perfil</h4>
                <p className="text-sm text-gray-400">Configura tu cuenta</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}