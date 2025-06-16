"use client";

import { useState } from "react";
import { useCurrentUser } from "@/lib/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Save, Loader2 } from "lucide-react";
import { formatRut, validateRut } from "@/lib/utils/rut-validator";
import toast from "react-hot-toast";

export function UserProfile() {
  const { user, loading, updateUser, updateSettings } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    tax_id: user?.tax_id || "",
    phone: user?.phone || "",
    address: user?.address || "",
    position: user?.position || "",
    department: user?.department || ""
  });

  const [settings, setSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications ?? true,
    twoFactorAuth: user?.settings?.twoFactorAuth ?? false,
    theme: user?.settings?.theme || "light"
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No se pudo cargar la información del usuario</p>
        </CardContent>
      </Card>
    );
  }

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (field === 'tax_id') {
      value = formatRut(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (formData.tax_id && !validateRut(formData.tax_id)) {
      toast.error("RUT inválido");
      return;
    }

    setIsSaving(true);
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsChange = async (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await updateSettings({ [key]: value });
    } catch (error) {
      // Revertir cambio si falla
      setSettings(settings);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con avatar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profile_photo_url || undefined} />
              <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.full_name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center mt-2 space-x-4 text-sm">
                {user.user_type && (
                  <span className="flex items-center">
                    <Shield className="mr-1 h-3 w-3" />
                    {user.user_type === 'admin' ? 'Administrador' : 
                     user.user_type === 'accountant' ? 'Contador' : 'Cliente'}
                  </span>
                )}
                {user.created_at && (
                  <span className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    Miembro desde {new Date(user.created_at).toLocaleDateString('es-CL')}
                  </span>
                )}
              </div>
            </div>
            <Button 
              variant={isEditing ? "secondary" : "default"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </>
              ) : (
                "Editar perfil"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs con información */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="work">Información Laboral</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>
                Información básica de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input
                    id="first_name"
                    value={isEditing ? formData.first_name : user.first_name}
                    onChange={handleChange('first_name')}
                    disabled={!isEditing}
                    icon={<User className="h-4 w-4" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    value={isEditing ? formData.last_name : user.last_name}
                    onChange={handleChange('last_name')}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id">RUT</Label>
                <Input
                  id="tax_id"
                  value={isEditing ? formData.tax_id : user.tax_id || ""}
                  onChange={handleChange('tax_id')}
                  disabled={!isEditing}
                  placeholder="12.345.678-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  icon={<Mail className="h-4 w-4" />}
                />
                <p className="text-xs text-muted-foreground">
                  El email no puede ser modificado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={isEditing ? formData.phone : user.phone || ""}
                  onChange={handleChange('phone')}
                  disabled={!isEditing}
                  placeholder="+56 9 1234 5678"
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={isEditing ? formData.address : user.address || ""}
                  onChange={handleChange('address')}
                  disabled={!isEditing}
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Laboral</CardTitle>
              <CardDescription>
                Datos relacionados con tu trabajo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={isEditing ? formData.position : user.position || ""}
                    onChange={handleChange('position')}
                    disabled={!isEditing}
                    icon={<Briefcase className="h-4 w-4" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={isEditing ? formData.department : user.department || ""}
                    onChange={handleChange('department')}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {user.hire_date && (
                <div className="space-y-2">
                  <Label>Fecha de Ingreso</Label>
                  <Input
                    value={new Date(user.hire_date).toLocaleDateString('es-CL')}
                    disabled
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </div>
              )}

              {user.contract_type && (
                <div className="space-y-2">
                  <Label>Tipo de Contrato</Label>
                  <Input
                    value={user.contract_type}
                    disabled
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Cuenta</CardTitle>
              <CardDescription>
                Personaliza tu experiencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones importantes por correo
                  </p>
                </div>
                <Button
                  variant={settings.emailNotifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingsChange('emailNotifications', !settings.emailNotifications)}
                >
                  {settings.emailNotifications ? "Activado" : "Desactivado"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">
                    Añade una capa extra de seguridad
                  </p>
                </div>
                <Button
                  variant={settings.twoFactorAuth ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingsChange('twoFactorAuth', !settings.twoFactorAuth)}
                >
                  {settings.twoFactorAuth ? "Activado" : "Desactivado"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Selecciona el tema de la interfaz
                  </p>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingsChange('theme', e.target.value)}
                  className="px-3 py-1 border rounded-md"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {user.last_login && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Último acceso</span>
                    <span>{new Date(user.last_login).toLocaleString('es-CL')}</span>
                  </div>
                  {user.last_login_ip && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP del último acceso</span>
                      <span className="font-mono">{user.last_login_ip}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
