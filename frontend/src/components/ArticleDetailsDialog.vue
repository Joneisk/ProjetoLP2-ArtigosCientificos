<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { X, User, ThumbsUp, ThumbsDown, MessageSquare, Edit } from 'lucide-vue-next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Article, Feedback } from '@/types';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';

const props = defineProps<{
  open: boolean;
  article: Article | null;
  feedbacks: Feedback[];
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  like: [];
  dislike: [];
  addFeedback: [comment: string];
  editArticle: [];
}>();

const authStore = useAuthStore();
const newComment = ref('');

const formattedDate = computed(() => {
  if (!props.article?.date) return '';
  return format(new Date(props.article.date), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
});

const isAuthor = computed(() => {
  return authStore.user?.id === props.article?.authorId || props.article?.authorId === undefined;
});
const handleAddFeedback = () => {
  if (!newComment.value.trim()) {
    toast.error('Digite um comentário antes de enviar');
    return;
  }

  emit('addFeedback', newComment.value);
  newComment.value = '';
  toast.success('Feedback adicionado com sucesso!');
};

const handleClose = () => {
  emit('update:open', false);
  newComment.value = '';
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


const handleEdit = () => {
  emit('editArticle');
  handleClose();
};

const formatFeedbackDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR,
  });
};
</script>

<template>
  <Transition name="fade">
    <div v-if="open && article" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1 pr-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ article.title }}
            </h2>
            <span class="badge badge-primary">{{ article.category }}</span>
          </div>
          <button
            @click="handleClose"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X :size="20" class="text-gray-600" />
          </button>
        </div>

        <!-- Metadados -->
        <div class="space-y-2 mb-6">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <User :size="16" />
            <span>{{ article.authors.join(', ') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ formattedDate }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="keyword in article.keywords"
              :key="keyword"
              class="badge badge-outline"
            >
              {{ keyword }}
            </span>
          </div>
        </div>

        <!-- Abstract -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Resumo</h3>
          <p class="text-gray-700">{{ article.abstract }}</p>
        </div>

        <hr class="my-6 border-gray-200" />

        <!-- Conteúdo -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Conteúdo Completo</h3>
          <p class="text-gray-700 whitespace-pre-wrap">{{ article.content }}</p>
        </div>

        <hr class="my-6 border-gray-200" />

        <!-- Botões de interação -->
        <div class="flex items-center gap-4 mb-6">
          <button
            @click="emit('like')"
            :disabled="!authStore.user"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              article.userVote === 'like'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600',
              !authStore.user && 'opacity-50 cursor-not-allowed'
            ]"
          >
            <ThumbsUp :size="20" />
            <span class="font-medium">{{ article.likes }}</span>
          </button>

          <button
            @click="emit('dislike')"
            :disabled="!authStore.user"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              article.userVote === 'dislike'
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600',
              !authStore.user && 'opacity-50 cursor-not-allowed'
            ]"
          >
            <ThumbsDown :size="20" />
            <span class="font-medium">{{ article.dislikes }}</span>
          </button>

          <button
            v-if="isAuthor"
            @click="handleEdit"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
          >
            <Edit :size="18" />
            Editar Artigo
          </button>
        </div>

        <hr class="my-6 border-gray-200" />

        <!-- Seção de Feedbacks -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <MessageSquare :size="20" class="text-gray-600" />
            <h3 class="text-lg font-semibold text-gray-900">
              Feedbacks ({{ feedbacks.length }})
            </h3>
          </div>

          <!-- Formulário de novo feedback -->
          <div v-if="authStore.user" class="mb-6">
            <textarea
              v-model="newComment"
              rows="3"
              placeholder="Deixe seu feedback sobre este artigo..."
              class="textarea mb-2"
            />
            <button
              @click="handleAddFeedback"
              class="btn btn-primary"
            >
              Enviar Feedback
            </button>
          </div>

          <div v-else class="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
            Faça login para deixar seu feedback
          </div>

          <!-- Lista de feedbacks -->
          <div v-if="feedbacks.length > 0" class="space-y-4">
            <div
              v-for="feedback in feedbacks"
              :key="feedback.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User :size="20" class="text-white" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-gray-900">{{ feedback.userName }}</span>
                    <span class="text-sm text-gray-500">{{ formatFeedbackDate(feedback.createdAt) }}</span>
                  </div>
                  <p class="text-gray-700">{{ feedback.comment }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            Nenhum feedback ainda. Seja o primeiro!
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>