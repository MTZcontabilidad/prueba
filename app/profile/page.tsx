'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Shield,
  Bell,
  Palette,
  Save,
  ArrowLeft,
  Sparkles,
  Edit3
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  phone?: string
  address?: string
  city?: string
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: ''
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession()

        if (error || !session) {
          router.push('/auth/login')
          return
        }

        // Obtener datos del perfil
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: profile?.full_name || '',
          phone: profile?.phone || '',
          address: profile?.address || '',
          city: profile?.city || '',
          created_at: session.user.created_at || ''
        }

        setUser(userData)
        setFormData({
          full_name: userData.full_name,
          phone: userData.phone,
          address: userData.address,
          city: userData.city
        })
      } catch (error) {
        console.error('Error obteniendo usuario:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router, supabase])

  const handleSave = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setUser({ ...user, ...formData })
      setEditing(false)
    } catch (error) {
      console.error('Error actualizando perfil:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="glow-pulse mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
            <Sparkles className="h-6 w-6 animate-spin text-white" />
          </div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="circuit-pattern absolute inset-0 opacity-20" />

      {/* Floating orbs */}
      <div className="float-gentle absolute left-20 top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div
        className="float-gentle absolute bottom-20 right-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="glow-multi rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-gray-300 transition-all duration-300 hover:text-cyan-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-glow-intense bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                Mi Perfil
              </h1>
              <p className="mt-2 text-gray-400">Gestiona tu información personal</p>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className={`shine-effect glow-multi rounded-lg px-4 py-2 text-white transition-all duration-300 ${
              editing
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
            }`}
          >
            <Edit3 className="mr-2 inline h-4 w-4" />
            {editing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="text-center">
              <div className="glow-pulse mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
                <User className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-glow text-xl font-semibold text-white">
                {user?.full_name || 'Usuario'}
              </h3>
              <p className="text-gray-400">{user?.email}</p>
              <div className="mt-4 flex justify-center">
                <div className="glow-multi inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-xs text-green-400">Activo</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">
                  Miembro desde {new Date(user?.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
              <h3 className="text-glow mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <Settings className="h-5 w-5 text-cyan-400" />
                Información Personal
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Nombre Completo
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="glow-multi w-full rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-2">
                      <User className="h-4 w-4 text-cyan-400" />
                      <span className="text-white">{user?.full_name || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Correo Electrónico
                  </label>
                  <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-2">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    <span className="text-white">{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Teléfono
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="glow-multi w-full rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-2">
                      <Phone className="h-4 w-4 text-cyan-400" />
                      <span className="text-white">{user?.phone || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Ciudad
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="glow-multi w-full rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-2">
                      <MapPin className="h-4 w-4 text-cyan-400" />
                      <span className="text-white">{user?.city || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Dirección
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="glow-multi w-full rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-start gap-3 rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-2">
                      <MapPin className="mt-1 h-4 w-4 text-cyan-400" />
                      <span className="text-white">{user?.address || 'No especificado'}</span>
                    </div>
                  )}
                </div>
              </div>

              {editing && (
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="glow-multi rounded-lg border border-gray-600 bg-gray-800/50 px-6 py-2 text-gray-300 transition-all duration-300 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="shine-effect glow-multi rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 text-white transition-all duration-300 hover:from-cyan-400 hover:to-blue-500"
                  >
                    <Save className="mr-2 inline h-4 w-4" />
                    Guardar Cambios
                  </button>
                </div>
              )}
            </div>

            {/* Security Settings */}
            <div className="mt-8 multi-border shine-effect glow-multi rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 backdrop-blur-xl">
              <h3 className="text-glow mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <Shield className="h-5 w-5 text-cyan-400" />
                Configuración de Seguridad
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/30 p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-white">Notificaciones por Email</p>
                      <p className="text-sm text-gray-400">Recibir alertas importantes</p>
                    </div>
                  </div>
                  <div className="glow-multi h-6 w-11 rounded-full bg-cyan-500 p-1">
                    <div className="h-4 w-4 rounded-full bg-white transition-transform translate-x-5" />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/30 p-4">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-white">Tema Oscuro</p>
                      <p className="text-sm text-gray-400">Interfaz optimizada para poca luz</p>
                    </div>
                  </div>
                  <div className="glow-multi h-6 w-11 rounded-full bg-cyan-500 p-1">
                    <div className="h-4 w-4 rounded-full bg-white transition-transform translate-x-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
