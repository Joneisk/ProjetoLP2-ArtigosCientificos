<script setup lang="ts">
import { User, ThumbsUp, ThumbsDown, MessageSquare, Calendar, BookOpen } from 'lucide-vue-next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Article } from '@/types';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  article: Article;
}>();

const emit = defineEmits<{
  viewDetails: [];
  like: [];
  dislike: [];
}>();

const authStore = useAuthStore();

const formattedDate = props.article.date 
  ? format(new Date(props.article.date), 'dd MMM yyyy', { locale: ptBR })
  : 'Data desconhecida';

const handleLike = (e: Event) => {
  e.stopPropagation();
  if (authStore.user) {
    emit('like');
  }
};

const handleDislike = (e: Event) => {
  e.stopPropagation();
  if (authStore.user) {
    emit('dislike');
  }
};
</script>

<template>
  <div
    @click="emit('viewDetails')"
    class="bg-card rounded-lg border border-border hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
  >
    <!-- Header com Título e Badge -->
    <div class="border-b border-border p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3 mb-2">
        <h3 class="text-base font-bold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
          {{ article.title }}
        </h3>
        <span class="badge badge-primary text-xs font-bold flex-shrink-0">{{ article.category }}</span>
      </div>
      <p class="text-xs text-muted-foreground line-clamp-2">
        {{ article.abstract }}
      </p>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-5 space-y-3">
      <!-- Metadados -->
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <User :size="14" class="flex-shrink-0" />
          <span class="truncate">{{ article.authors.slice(0, 1).join(', ') }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar :size="14" class="flex-shrink-0" />
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Keywords -->
      <div class="flex flex-wrap gap-1">
        <span
          v-for="keyword in article.keywords?.slice(0, 3)"
          :key="keyword"
          class="badge badge-outline text-xs"
        >
          {{ keyword }}
        </span>
      </div>

      <!-- Botões de interação -->
      <div class="flex items-center gap-2 pt-2 border-t border-border">
        <!-- Like -->
        <button
          @click.stop="handleLike"
          :disabled="!authStore.user"
          :class="[
            'flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium',
            article.userVote === 'like'
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-accent text-muted-foreground',
            !authStore.user && 'opacity-50 cursor-not-allowed'
          ]"
          title="Curtir"
        >
          <ThumbsUp :size="14" />
          <span>{{ article.likes }}</span>
        </button>

        <!-- Dislike -->
        <button
          @click.stop="handleDislike"
          :disabled="!authStore.user"
          :class="[
            'flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium',
            article.userVote === 'dislike'
              ? 'bg-destructive/10 text-destructive'
              : 'hover:bg-accent text-muted-foreground',
            !authStore.user && 'opacity-50 cursor-not-allowed'
          ]"
          title="Não curtir"
        >
          <ThumbsDown :size="14" />
          <span>{{ article.dislikes }}</span>
        </button>

        <!-- Feedbacks -->
        <button
          class="flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground transition-colors"
          title="Feedbacks"
        >
          <MessageSquare :size="14" />
          <span>0</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>