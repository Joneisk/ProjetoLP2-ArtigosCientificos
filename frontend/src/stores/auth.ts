import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authAPI } from '@/services/api';

export interface User {
  id?: string;
  name: string;
  email: string;
  institution?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Restaurar usuário do localStorage ao inicializar
  const restoreUser = () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        user.value = JSON.parse(stored);
      } catch {
        localStorage.removeItem('user');
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.usuario) {
        user.value = {
          id: response.usuario.id,
          name: response.usuario.nome,
          email: response.usuario.email,
          institution: response.usuario.instituicao,
        };
        localStorage.setItem('user', JSON.stringify(user.value));
        return true;
      }
      
      error.value = response.message || 'Falha ao fazer login';
      return false;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      error.value = serverMessage || (err instanceof Error ? err.message : 'Erro ao fazer login');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string, institution?: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authAPI.register(name, email, password, institution);
      
      if (response.success && response.usuario) {
        user.value = {
          id: response.usuario.id,
          name: response.usuario.nome,
          email: response.usuario.email,
          institution: response.usuario.instituicao,
        };
        localStorage.setItem('user', JSON.stringify(user.value));
        return true;
      }
      
      error.value = response.message || 'Falha ao registrar';
      return false;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      error.value = serverMessage || (err instanceof Error ? err.message : 'Erro ao registrar');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const resetPassword = async (email: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authAPI.resetPassword(email, currentPassword, newPassword);
      
      if (response.success) {
        return true;
      }
      
      error.value = response.message || 'Falha ao redefinir senha';
      return false;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      error.value = serverMessage || (err instanceof Error ? err.message : 'Erro ao redefinir senha');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token && user.value !== null;
  };

  // Inicializar usuário ao carregar o store
  restoreUser();

  return {
    user,
    isLoading,
    error,
    login,
    register,
    resetPassword,
    logout,
    checkAuth,
    restoreUser,
  };
});
