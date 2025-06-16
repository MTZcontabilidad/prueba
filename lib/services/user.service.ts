import { createClient } from '@/lib/supabase/client';
import { User, UserInsert, UserUpdate } from '@/lib/supabase/types';

export class UserService {
  /**
   * Obtener el usuario actual autenticado
   */
  static async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();
    
    // Obtener sesión actual
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return null;
    
    // Obtener datos del usuario desde nuestra tabla
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return data;
  }
  
  /**
   * Crear un nuevo usuario después del registro
   */
  static async createUserAfterSignUp(
    authId: string,
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      taxId?: string;
      clientId?: string;
    }
  ): Promise<User> {
    const supabase = createClient();
    
    const newUser: UserInsert = {
      auth_id: authId,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      tax_id: userData.taxId || null,
      client_id: userData.clientId || null,
      user_type: 'client', // Default
      is_active: true,
      must_change_password: false,
      failed_login_attempts: 0,
      settings: {}
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Actualizar información del usuario
   */
  static async updateUser(id: string, updates: UserUpdate): Promise<User> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Actualizar último login
   */
  static async updateLastLogin(authId: string, ip?: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        last_login_ip: ip || null,
        updated_at: new Date().toISOString()
      })
      .eq('auth_id', authId);
    
    if (error) {
      console.error('Error updating last login:', error);
    }
  }
  
  /**
   * Obtener usuarios por cliente
   */
  static async getUsersByClient(clientId: string): Promise<User[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  /**
   * Verificar si un email ya existe
   */
  static async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const supabase = createClient();
    
    let query = supabase
      .from('users')
      .select('id')
      .eq('email', email);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return (data && data.length > 0);
  }
  
  /**
   * Cambiar contraseña del usuario
   */
  static async changePassword(newPassword: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    // Marcar que ya no necesita cambiar contraseña
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('users')
        .update({
          must_change_password: false,
          updated_at: new Date().toISOString()
        })
        .eq('auth_id', user.id);
    }
  }
  
  /**
   * Manejar intento fallido de login
   */
  static async handleFailedLogin(email: string): Promise<void> {
    const supabase = createClient();
    
    const { data: user } = await supabase
      .from('users')
      .select('id, failed_login_attempts')
      .eq('email', email)
      .single();
    
    if (user) {
      const attempts = (user.failed_login_attempts || 0) + 1;
      const lockedUntil = attempts >= 5 
        ? new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
        : null;
      
      await supabase
        .from('users')
        .update({
          failed_login_attempts: attempts,
          locked_until: lockedUntil,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    }
  }
  
  /**
   * Resetear intentos fallidos
   */
  static async resetFailedAttempts(email: string): Promise<void> {
    const supabase = createClient();
    
    await supabase
      .from('users')
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);
  }
  
  /**
   * Verificar si el usuario está bloqueado
   */
  static async isUserLocked(email: string): Promise<boolean> {
    const supabase = createClient();
    
    const { data } = await supabase
      .from('users')
      .select('locked_until')
      .eq('email', email)
      .single();
    
    if (!data || !data.locked_until) return false;
    
    return new Date(data.locked_until) > new Date();
  }
  
  /**
   * Actualizar configuración del usuario
   */
  static async updateSettings(userId: string, settings: any): Promise<void> {
    const supabase = createClient();
    
    const { data: currentUser } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .single();
    
    const newSettings = {
      ...(currentUser?.settings || {}),
      ...settings
    };
    
    await supabase
      .from('users')
      .update({
        settings: newSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
  }
  
  /**
   * Desactivar usuario
   */
  static async deactivateUser(id: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('users')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }
  
  /**
   * Obtener estadísticas de usuarios
   */
  static async getUserStats() {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('user_type, is_active');
    
    if (error) throw error;
    
    const users = data || [];
    
    return {
      total: users.length,
      active: users.filter(u => u.is_active).length,
      byType: users.reduce((acc, user) => {
        const type = user.user_type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
