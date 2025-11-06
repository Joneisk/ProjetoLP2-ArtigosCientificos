<template>
  <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
    <div class="container flex h-16 items-center justify-between px-4">
      <!-- LOGO -->
      <div class="flex items-center gap-2 select-none">
        <BookOpen class="h-6 w-6 text-blue-600" />
        <span class="text-xl text-blue-600 font-semibold">SciHub Research</span>
      </div>

      <!-- AÇÕES -->
      <div class="flex items-center gap-3">
        <!-- ✅ Usuário logado -->
        <template v-if="user?.value">
          <Button @click="props.onNewArticleClick" class="gap-2">
            <PlusCircle class="h-4 w-4" />
            Novo Artigo
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" class="gap-2">
                <User class="h-4 w-4" />
                {{ user?.value?.name || 'Usuário' }}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" class="w-56">
              <div class="px-2 py-1.5">
                <p class="text-sm font-medium">{{ user?.value?.name }}</p>
                <p class="text-xs text-gray-500">{{ user?.value?.email }}</p>
                <p v-if="user?.value?.institution" class="text-xs text-gray-500">
                  {{ user?.value?.institution }}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                @click="handleLogout"
                class="gap-2 text-red-600 cursor-pointer"
              >
                <LogOut class="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>

        <!-- 🚪 Usuário não logado -->
        <template v-else>
          <Button variant="outline" @click="props.onLoginClick" class="gap-2">
            <LogIn class="h-4 w-4" />
            Entrar
          </Button>
          <Button @click="props.onRegisterClick">Registrar</Button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { BookOpen, LogIn, LogOut, User, PlusCircle } from 'lucide-vue-next'
import { useAuth } from '@/contexts/AuthContext'

// UI Components (adaptados do shadcn-vue)
import { Button } from '@/components/ui/button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.vue'

// Props
const props = defineProps<{
  onLoginClick: () => void
  onRegisterClick: () => void
  onNewArticleClick: () => void
}>()

// Contexto de autenticação
const auth = useAuth()
const user = auth?.user
const logout = auth?.logout

function handleLogout() {
  if (logout) logout()
}
</script>
