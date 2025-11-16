<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { authAPI } from '@/services/api';
import { toast } from 'vue-sonner';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const authStore = useAuthStore();
const senhaAtual = ref('');
const senhaNova = ref('');
const senhaConfirm = ref('');
const loading = ref(false);

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    senhaAtual.value = '';
    senhaNova.value = '';
    senhaConfirm.value = '';
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
  if (!senhaAtual.value || !senhaNova.value || !senhaConfirm.value) {
    toast.error('Preencha todos os campos');
    return;
  }

  if (senhaNova.value !== senhaConfirm.value) {
    toast.error('As senhas não conferem');
    return;
  }

  if (senhaNova.value.length < 6) {
    toast.error('A nova senha deve ter pelo menos 6 caracteres');
    return;
  }

  loading.value = true;

  try {
    const response = await authAPI.resetPassword(
      authStore.user?.email || '',
      senhaAtual.value,
      senhaNova.value
    );

    if (response.success) {
      toast.success('Senha atualizada com sucesso!');
      emit('update:open', false);
    } else {
      toast.error(response.message || 'Erro ao redefinir senha');
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao redefinir senha');
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
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Redefinir Senha</h2>
          <button
            @click="handleClose"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X :size="20" class="text-gray-600" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Senha Atual *
            </label>
            <input
              v-model="senhaAtual"
              type="password"
              required
              placeholder="Sua senha atual"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nova Senha *
            </label>
            <input
              v-model="senhaNova"
              type="password"
              required
              placeholder="Sua nova senha"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nova Senha *
            </label>
            <input
              v-model="senhaConfirm"
              type="password"
              required
              placeholder="Confirme sua nova senha"
              class="input"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            {{ loading ? 'Redefinindo...' : 'Redefinir Senha' }}
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>
