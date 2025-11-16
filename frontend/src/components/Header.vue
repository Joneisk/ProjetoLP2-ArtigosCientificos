<script setup lang="ts">
import { ref } from 'vue';
import { BookOpen, PlusCircle, User, ChevronDown } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['openLogin', 'openRegister', 'openNewArticle']);

const authStore = useAuthStore();
const showDropdown = ref(false);

const handleLogout = () => {
  authStore.logout();
  showDropdown.value = false;
};
</script>

<template>
  <header class="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3 text-primary font-bold">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
            <BookOpen :size="24" class="text-primary-foreground" />
          </div>
          <span class="text-lg hidden sm:inline">SciHub</span>
        </div>

        <!-- Controles -->
        <div class="flex items-center gap-3">
          <template v-if="!authStore.user">
            <button @click="emit('openLogin')" class="btn btn-outline hidden sm:inline-flex">
              Entrar
            </button>
            <button @click="emit('openRegister')" class="btn btn-primary">
              Registrar
            </button>
          </template>

          <template v-else>
            <button @click="emit('openNewArticle')" class="btn btn-primary flex items-center gap-2 hidden sm:inline-flex">
              <PlusCircle :size="18" />
              Novo Artigo
            </button>
            <button @click="emit('openNewArticle')" class="btn btn-primary p-2 sm:hidden">
              <PlusCircle :size="18" />
            </button>

            <div class="relative">
              <button
                @click="showDropdown = !showDropdown"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-md">
                  <User :size="18" class="text-primary-foreground" />
                </div>
                <ChevronDown :size="16" class="text-muted-foreground hidden sm:inline" />
              </button>

              <Transition name="fade">
                <div
                  v-if="showDropdown"
                  class="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border py-2"
                  @click="showDropdown = false"
                >
                  <div class="px-4 py-3 border-b border-border">
                    <p class="text-sm font-semibold text-foreground">{{ authStore.user.name }}</p>
                    <p class="text-xs text-muted-foreground mt-1">{{ authStore.user.email }}</p>
                    <p v-if="authStore.user.institution" class="text-xs text-muted-foreground mt-1">
                      {{ authStore.user.institution }}
                    </p>
                  </div>
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium"
                  >
                    Sair
                  </button>
                </div>
              </Transition>
            </div>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>