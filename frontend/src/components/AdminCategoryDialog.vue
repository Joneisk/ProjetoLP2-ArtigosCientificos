<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { X, Trash2 } from 'lucide-vue-next';
import { useArticlesStore } from '@/stores/articles';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import { categoriaAPI } from '@/services/api';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const articlesStore = useArticlesStore();
const authStore = useAuthStore();
const nome = ref('');
const descricao = ref('');
const loading = ref(false);

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    nome.value = '';
    descricao.value = '';
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
  if (!nome.value.trim()) {
    toast.error('Digite o nome da categoria');
    return;
  }

  loading.value = true;

  try {
    const adminEmail = authStore.user?.email;
    const newCategory = await categoriaAPI.create(nome.value, descricao.value, adminEmail);
    
    // Atualizar categorias no store
    await articlesStore.fetchCategories();
    
    toast.success('Categoria criada com sucesso!');
    nome.value = '';
    descricao.value = '';
    emit('update:open', false);
  } catch (error: any) {
    const message = error.response?.data?.message || 'Erro ao criar categoria';
    toast.error(message);
  } finally {
    loading.value = false;
  }
};

const handleDeleteCategory = async (id: string) => {
  if (!confirm('Tem certeza que deseja deletar esta categoria?')) {
    return;
  }

  try {
    const adminEmail = authStore.user?.email;
    await categoriaAPI.delete(id, adminEmail);
    await articlesStore.fetchCategories();
    toast.success('Categoria deletada com sucesso!');
  } catch (error: any) {
    const message = error.response?.data?.message || 'Erro ao deletar categoria';
    toast.error(message);
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
          <h2 class="text-2xl font-bold text-gray-900">Gerenciar Categorias</h2>
          <button
            @click="handleClose"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X :size="20" class="text-gray-600" />
          </button>
        </div>

        <!-- Formulário para criar categoria -->
        <form @submit.prevent="handleSubmit" class="space-y-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nome da Categoria *
            </label>
            <input
              v-model="nome"
              type="text"
              required
              placeholder="Ex: Medicina, Física..."
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              v-model="descricao"
              rows="2"
              placeholder="Descrição da categoria (opcional)"
              class="textarea"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            {{ loading ? 'Criando...' : 'Criar Categoria' }}
          </button>
        </form>

        <!-- Lista de categorias -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Categorias Existentes</h3>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="category in articlesStore.categories"
              :key="category._id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ category.nome }}</p>
                <p v-if="category.descricao" class="text-xs text-gray-500 mt-1">
                  {{ category.descricao }}
                </p>
              </div>
              <button
                @click="handleDeleteCategory(category._id)"
                class="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-2"
              >
                <Trash2 :size="16" />
              </button>
            </div>

            <div v-if="articlesStore.categories.length === 0" class="text-center py-4 text-gray-500 text-sm">
              Nenhuma categoria criada ainda
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
