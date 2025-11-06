<!-- src/components/ArticleCard.vue -->
<template>
  <Card
    class="hover:shadow-lg transition-shadow cursor-pointer"
    @click="() => props.onViewDetails(props.article)"
  >
    <CardHeader>
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1">
          <CardTitle class="mb-2">{{ props.article.title }}</CardTitle>
          <CardDescription>{{ props.article.abstract }}</CardDescription>
        </div>
        <Badge variant="secondary">{{ props.article.category }}</Badge>
      </div>
    </CardHeader>

    <CardContent>
      <div class="space-y-3">
        <!-- Autor -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <User class="h-4 w-4" />
          <span>{{ props.article.authors.join(', ') }}</span>
        </div>

        <!-- Data -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <Calendar class="h-4 w-4" />
          <span>{{ formatDate(props.article.publishedDate) }}</span>
        </div>

        <!-- Palavras-chave -->
        <div class="flex flex-wrap gap-1">
          <Badge
            v-for="(keyword, index) in props.article.keywords"
            :key="index"
            variant="outline"
            class="text-xs"
          >
            {{ keyword }}
          </Badge>
        </div>

        <!-- Botões -->
        <div class="flex items-center gap-3 pt-2 border-t">
          <!-- Like -->
          <Button
            variant="ghost"
            size="sm"
            class="gap-1"
            :disabled="!props.isLoggedIn"
            @click.stop="handleLike"
          >
            <ThumbsUp
              class="h-4 w-4"
              :class="{ 'fill-blue-500 text-blue-500': props.article.userVote === 'like' }"
            />
            <span>{{ props.article.likes }}</span>
          </Button>

          <!-- Dislike -->
          <Button
            variant="ghost"
            size="sm"
            class="gap-1"
            :disabled="!props.isLoggedIn"
            @click.stop="handleDislike"
          >
            <ThumbsDown
              class="h-4 w-4"
              :class="{ 'fill-red-500 text-red-500': props.article.userVote === 'dislike' }"
            />
            <span>{{ props.article.dislikes }}</span>
          </Button>

          <!-- Feedback -->
          <Button variant="ghost" size="sm" class="gap-1">
            <MessageSquare class="h-4 w-4" />
            <span>Feedbacks</span>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ThumbsUp, ThumbsDown, MessageSquare, Calendar, User } from 'lucide-vue-next'

// UI Components (shadcn-vue adaptados)
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card.vue'
import { Button } from '@/components/ui/button.vue'
import { Badge } from '@/components/ui/badge.vue'

// Tipagem e props
const props = defineProps<{
  article: {
    id: string
    title: string
    abstract: string
    content: string
    authors: string[]
    keywords: string[]
    category: string
    publishedDate: string
    likes: number
    dislikes: number
    userVote?: 'like' | 'dislike' | null
  }
  isLoggedIn?: boolean
  onViewDetails: (article: any) => void
  onLike?: (articleId: string) => void
  onDislike?: (articleId: string) => void
}>()

// Métodos
function handleLike() {
  if (props.isLoggedIn && props.onLike) props.onLike(props.article.id)
}

function handleDislike() {
  if (props.isLoggedIn && props.onDislike) props.onDislike(props.article.id)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>
