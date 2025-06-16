import { useState, useEffect, useCallback } from 'react';
import { UserService } from '@/lib/services/user.service';
import { User } from '@/lib/supabase/types';
import toast from 'react-hot-toast';

interface UseCurrentUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateSettings: (settings: unknown) => Promise<void>;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await UserService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = await UserService.updateUser(user.id, updates);
      setUser(updatedUser);
      toast.success('Perfil actualizado exitosamente');
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Error al actualizar perfil');
      throw err;
    }
  }, [user]);

  const updateSettings = useCallback(async (settings: unknown) => {
    if (!user) return;
    
    try {
      await UserService.updateSettings(user.id, settings);
      setUser(prev => prev ? { ...prev, settings: { ...prev.settings, ...settings } } : null);
      toast.success('Configuración actualizada');
    } catch (err) {
      console.error('Error updating settings:', err);
      toast.error('Error al actualizar configuración');
      throw err;
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
    updateSettings
  };
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsersByClient: (clientId: string) => Promise<void>;
  createUser: (userData: unknown) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User>;
  deactivateUser: (id: string) => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersByClient = useCallback(async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getUsersByClient(clientId);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: unknown) => {
    try {
      const newUser = await UserService.createUserAfterSignUp(
        userData.authId,
        userData
      );
      setUsers(prev => [...prev, newUser]);
      toast.success('Usuario creado exitosamente');
      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error('Error al crear usuario');
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = await UserService.updateUser(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      toast.success('Usuario actualizado exitosamente');
      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Error al actualizar usuario');
      throw err;
    }
  }, []);

  const deactivateUser = useCallback(async (id: string) => {
    try {
      await UserService.deactivateUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('Usuario desactivado exitosamente');
    } catch (err) {
      console.error('Error deactivating user:', err);
      toast.error('Error al desactivar usuario');
      throw err;
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsersByClient,
    createUser,
    updateUser,
    deactivateUser
  };
}
