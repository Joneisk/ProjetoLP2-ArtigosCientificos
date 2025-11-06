<!-- src/components/ArticleDetailsDialog.vue -->
<template>
  <Dialog :open="props.open" @update:open="props.onOpenChange">
    <DialogContent class="max-w-4xl max-h-[90vh]">
      <DialogHeader>
        <div class="flex items-start justify-between gap-4">
          <DialogTitle class="text-2xl pr-8">{{ props.article?.title }}</DialogTitle>
          <Badge variant="secondary">{{ props.article?.category }}</Badge>
        </div>
      </DialogHeader>

      <ScrollArea class="h-[calc(90vh-120px)] pr-4">
        <div class="space-y-6">
          <!-- Metadados -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <User class="h-4 w-4" />
              <span>{{ props.article?.authors.join(', ') }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Calendar class="h-4 w-4" />
              <span>{{ formatDate(props.article?.publishedDate) }}</span>
            </div>

            <div class="flex flex-wrap gap-1">
              <Badge
                v-for="(keyword, index) in props.article?.keywords"
                :key="index"
                variant="outline"
                class="text-xs"
              >
                {{ keyword }}
              </Badge>
            </div>
          </div>

          <!-- Resumo -->
          <div>
            <p class="text-gray-700">{{ props.article?.abstract }}</p>
          </div>

          <Separator />

          <!-- Conteúdo -->
          <div>
            <p class="whitespace-pre-wrap text-gray-700">{{ props.article?.content }}</p>
          </div>

          <Separator />

          <!-- Likes / Dislikes / Editar -->
          <div class="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              class="gap-1"
              :disabled="!user.value"
              @click="() => user.value && props.onLike && props.onLike(props.article.id)"
            >
              <ThumbsUp
                class="h-4 w-4"
                :class="{ 'fill-blue-500 text-blue-500': props.article?.userVote === 'like' }"
              />
              <span>{{ props.article?.likes }}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              class="gap-1"
              :disabled="!user.value"
              @click="() => user.value && props.onDislike && props.onDislike(props.article.id)"
            >
              <ThumbsDown
                class="h-4 w-4"
                :class="{ 'fill-red-500 text-red-500': props.article?.userVote === 'dislike' }"
              />
              <span>{{ props.article?.dislikes }}</span>
            </Button>

            <Button
              v-if="isAuthor && props.onEdit"
              variant="outline"
              size="sm"
              class="gap-1 ml-auto"
              @click="() => { props.onEdit(props.article); props.onOpenChange(false); }"
            >
              <Edit class="h-4 w-4" />
              Editar Artigo
            </Button>
          </div>

          <Separator />

          <!-- Seção de Feedbacks -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <MessageSquare class="h-5 w-5" />
              <span class="text-lg">Feedbacks ({{ props.feedbacks.length }})</span>
            </div>

            <!-- Novo feedback -->
            <div v-if="user.value" class="space-y-2">
              <Textarea
                placeholder="Escreva seu feedback sobre este artigo..."
                v-model="newComment"
                rows="3"
              />
              <Button size="sm" @click="handleAddFeedback">Enviar Feedback</Button>
            </div>
            <p v-else class="text-sm text-gray-500">
              Faça login para deixar seu feedback.
            </p>

            <!-- Lista de feedbacks -->
            <div class="space-y-3">
              <p v-if="props.feedbacks.length === 0" class="text-sm text-gray-500">
                Nenhum feedback ainda. Seja o primeiro!
              </p>

              <div
                v-else
                v-for="feedback in props.feedbacks"
                :key="feedback.id"
                class="border rounded-lg p-4 space-y-2"
              >
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User class="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p class="text-sm">{{ feedback.userName }}</p>
                    <p class="text-xs text-gray-500">
                      {{ formatDateTime(feedback.createdAt) }}
                    </p>
                  </div>
                </div>
                <p class="text-sm text-gray-700">{{ feedback.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { useAuth } from '@/contexts/AuthContext'

// UI Components (shadcn-vue adaptados)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.vue'
import { Button } from '@/components/ui/button.vue'
import { Badge } from '@/components/ui/badge.vue'
import { Textarea } from '@/components/ui/textarea.vue'
import { ScrollArea } from '@/components/ui/scroll-area.vue'
import { Separator } from '@/components/ui/separator.vue'

// Ícones (lucide-vue-next)
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Calendar,
  User,
  Edit,
} from 'lucide-vue-next'

// Props
const props = defineProps<{
  open: boolean
  onOpenChange: (open: boolean) => void
  article: any
  feedbacks: any[]
  onLike?: (id: string) => void
  onDislike?: (id: string) => void
  onAddFeedback: (id: string, comment: string) => void
  onEdit?: (article: any) => void
}>()

// Auth context
const { user } = useAuth()
const newComment = ref('')

// Computed
const isAuthor = computed(() => user.value?.id === props.article?.authorId)

// Métodos
function handleAddFeedback() {
  if (!newComment.value.trim()) {
    toast.error('Digite um comentário antes de enviar.')
    return
  }
  props.onAddFeedback(props.article.id, newComment.value)
  newComment.value = ''
  toast.success('Feedback adicionado com sucesso!')
}

function formatDate(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR')
}

function formatDateTime(date: string) {
  const d = new Date(date)
  return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}
</script>
