<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const loading = ref(false);

// Limpa formulário quando fecha
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    email.value = '';
    password.value = '';
  }
});


const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) {
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
const handleSubmit = async () => {
  if (!email.value || !password.value) {
    toast.error('Preencha todos os campos');
    return;
  }

  loading.value = true;

  try {
    const success = await authStore.login(email.value, password.value);

    if (success) {
      toast.success('Login realizado com sucesso!');
      emit('update:open', false);
    } else {
      toast.error(authStore.error || 'Credenciais inválidas');
    }
  } catch (error) {
    toast.error(authStore.error || 'Erro ao fazer login');
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  emit('update:open', false);
};
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content w-full max-w-md p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Entrar</h2>
          <button
            @click="handleClose"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X :size="20" class="text-gray-600" />
          </button>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="seu@email.com"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="input"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>