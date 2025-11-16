<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';
import type { Article, ArticleFormData } from '@/types';
import { useArticlesStore } from '@/stores/articles';
import { toast } from 'vue-sonner';

const props = defineProps<{
  open: boolean;
  article?: Article | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  save: [data: ArticleFormData, articleId?: string];
}>();

const articlesStore = useArticlesStore();

const title = ref('');
const category = ref('');
const abstract = ref('');
const content = ref('');
const authors = ref('');
const keywords = ref('');

watch(() => props.article, (article) => {
  if (article) {
    title.value = article.title;
    category.value = article.category;
    abstract.value = article.abstract;
    content.value = article.content;
    authors.value = article.authors.join(', ');
    keywords.value = article.keywords.join(', ');
  }
});

watch(() => props.open, (isOpen) => {
  if (!isOpen && !props.article) {
    resetForm();
  }
});

const resetForm = () => {
  title.value = '';
  category.value = '';
  abstract.value = '';
  content.value = '';
  authors.value = '';
  keywords.value = '';
};

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

const handleSubmit = () => {
  if (!title.value || !category.value || !abstract.value || !content.value || !authors.value || !keywords.value) {
    toast.error('Preencha todos os campos');
    return;
  }

  const formData: ArticleFormData = {
    title: title.value,
    category: category.value,
    abstract: abstract.value,
    content: content.value,
    authors: authors.value,
    keywords: keywords.value,
  };

  emit('save', formData, props.article?.id);
  emit('update:open', false);
  resetForm();
};

const handleClose = () => {
  emit('update:open', false);
  if (!props.article) {
    resetForm();
  }
};
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ article ? 'Editar Artigo' : 'Publicar Novo Artigo' }}
          </h2>
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
              Título do Artigo *
            </label>
            <input
              v-model="title"
              type="text"
              required
              placeholder="Digite o título do artigo"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select v-model="category" required class="select">
              <option value="">Selecione uma categoria</option>
              <option v-for="cat in articlesStore.categories" :key="cat._id" :value="cat._id">
                {{ cat.nome }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Resumo / Abstract *
            </label>
            <textarea
              v-model="abstract"
              required
              rows="3"
              placeholder="Escreva um resumo do artigo"
              class="textarea"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo Completo *
            </label>
            <textarea
              v-model="content"
              required
              rows="8"
              placeholder="Escreva o conteúdo completo do artigo"
              class="textarea"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Autores *
            </label>
            <input
              v-model="authors"
              type="text"
              required
              placeholder="Separe os autores por vírgula"
              class="input"
            />
            <p class="text-xs text-gray-500 mt-1">
              Exemplo: Dr. João Silva, Dra. Maria Santos
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Palavras-chave *
            </label>
            <input
              v-model="keywords"
              type="text"
              required
              placeholder="Separe as palavras-chave por vírgula"
              class="input"
            />
            <p class="text-xs text-gray-500 mt-1">
              Exemplo: IA, Medicina, Diagnóstico
            </p>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="handleClose"
              class="btn btn-outline flex-1"
            >
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary flex-1">
              {{ article ? 'Atualizar' : 'Publicar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>