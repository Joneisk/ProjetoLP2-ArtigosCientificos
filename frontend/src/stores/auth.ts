import { defineStore } from 'pinia';
import { ref } from 'vue';

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

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Falha ao fazer login');
      }

      const data = await response.json();
      user.value = data.user;
      localStorage.setItem('token', data.token);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string, institution?: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, institution }),
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar');
      }

      const data = await response.json();
      user.value = data.user;
      localStorage.setItem('token', data.token);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('token');
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    // Aqui você pode validar o token com o backend se necessário
    // Por enquanto, apenas verifica se existe
    return !!token;
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };
});
