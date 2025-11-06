// src/contexts/AuthContext.ts
import { ref, provide, inject, type Ref, type InjectionKey } from 'vue'

// Tipagem do usuário
export interface User {
  id: string
  name: string
  email: string
  institution?: string
}

interface AuthContextType {
  user: Ref<User | null>
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, institution?: string) => Promise<boolean>
  logout: () => void
}

// Symbol tipado (melhor para TS)
const AuthSymbol: InjectionKey<AuthContextType> = Symbol('AuthContext')

// ======== PROVIDER ========
export function provideAuth() {
  const user = ref<User | null>(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (email && password) {
      user.value = {
        id: '1',
        name: 'Dr. João Silva',
        email,
        institution: 'Universidade Federal',
      }
      return true
    }
    return false
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    institution?: string
  ): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (name && email && password) {
      user.value = {
        id: Date.now().toString(),
        name,
        email,
        institution,
      }
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
  }

  const context: AuthContextType = { user, login, register, logout }
  provide(AuthSymbol, context)
  return context
}

// ======== CONSUMER (HOOK) ========
export function useAuth() {
  const context = inject(AuthSymbol)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
