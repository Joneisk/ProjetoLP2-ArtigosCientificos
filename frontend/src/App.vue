<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header
      @login-click="loginOpen = true"
      @register-click="registerOpen = true"
      @new-article-click="handleNewArticle"
    />

    <main class="container mx-auto px-4 py-8">
      <div class="mb-8 space-y-4">
        <div class="text-center space-y-2">
          <h1 class="text-4xl text-blue-600">SciHub Research</h1>
          <p class="text-gray-600">Plataforma de Artigos Científicos</p>
        </div>

        <SearchBar
          :search-query="searchQuery"
          :category="category"
          @update:search-query="searchQuery = $event"
          @update:category="category = $event"
        />
      </div>

      <div class="mb-4">
        <p class="text-sm text-gray-600">
          {{ filteredArticles.length }}
          {{ filteredArticles.length === 1 ? 'artigo encontrado' : 'artigos encontrados' }}
        </p>
      </div>

      <!-- Lista de artigos -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          v-for="article in filteredArticles"
          :key="article.id"
          :article="article"
          :is-logged-in="!!auth.user.value"
          @view-details="handleViewDetails"
          @like="handleLike"
          @dislike="handleDislike"
        />
      </div>

      <div v-if="filteredArticles.length === 0" class="text-center py-12">
        <p class="text-gray-500">Nenhum artigo encontrado com os filtros aplicados</p>
      </div>
    </main>

    <!-- Dialogs -->
    <LoginDialog :open="loginOpen" @update:open="loginOpen = $event" />
    <RegisterDialog :open="registerOpen" @update:open="registerOpen = $event" />
    <ArticleFormDialog
      :open="articleFormOpen"
      @update:open="articleFormOpen = $event"
      :editing-article="editingArticle"
      @save="handleSaveArticle"
    />
    <ArticleDetailsDialog
      :open="detailsOpen"
      @update:open="detailsOpen = $event"
      :article="selectedArticle"
      :feedbacks="articleFeedbacks"
      @like="handleLike"
      @dislike="handleDislike"
      @add-feedback="handleAddFeedback"
      @edit="handleEditArticle"
    />

    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { provideAuth } from '@/contexts/AuthContext'
import { mockArticles } from '@/data/mockArticles'
import type { Article, Feedback } from '@/types'
import { Toaster } from '@/components/ui/sonner'

// Components
import Header from '@/components/Header.vue'
import SearchBar from '@/components/SearchBar.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import RegisterDialog from '@/components/RegisterDialog.vue'
import ArticleFormDialog from '@/components/ArticleFormDialog.vue'
import ArticleDetailsDialog from '@/components/ArticleDetailsDialog.vue'

// ✅ Cria e fornece o contexto de autenticação global
const auth = provideAuth()

// Estado
const articles = ref<Article[]>(mockArticles)
const feedbacks = ref<Feedback[]>([])
const searchQuery = ref('')
const category = ref('all')
const loginOpen = ref(false)
const registerOpen = ref(false)
const articleFormOpen = ref(false)
const detailsOpen = ref(false)
const selectedArticle = ref<Article | null>(null)
const editingArticle = ref<Article | null>(null)

// 🔍 Filtragem
const filteredArticles = computed(() =>
  articles.value.filter((article) => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      !q ||
      article.title.toLowerCase().includes(q) ||
      article.abstract.toLowerCase().includes(q) ||
      article.keywords.some((k) => k.toLowerCase().includes(q)) ||
      article.authors.some((a) => a.toLowerCase().includes(q))

    const matchesCategory =
      category.value === 'all' || article.category === category.value
    return matchesSearch && matchesCategory
  })
)

// 👍 Likes e 👎 Dislikes
function handleLike(articleId: string) {
  articles.value = articles.value.map((article) => {
    if (article.id === articleId) {
      if (article.userVote === 'like') {
        return { ...article, likes: article.likes - 1, userVote: null }
      } else if (article.userVote === 'dislike') {
        return {
          ...article,
          likes: article.likes + 1,
          dislikes: article.dislikes - 1,
          userVote: 'like',
        }
      } else {
        return { ...article, likes: article.likes + 1, userVote: 'like' }
      }
    }
    return article
  })
}

function handleDislike(articleId: string) {
  articles.value = articles.value.map((article) => {
    if (article.id === articleId) {
      if (article.userVote === 'dislike') {
        return { ...article, dislikes: article.dislikes - 1, userVote: null }
      } else if (article.userVote === 'like') {
        return {
          ...article,
          dislikes: article.dislikes + 1,
          likes: article.likes - 1,
          userVote: 'dislike',
        }
      } else {
        return { ...article, dislikes: article.dislikes + 1, userVote: 'dislike' }
      }
    }
    return article
  })
}

// 📝 Criar ou editar artigo
function handleSaveArticle(articleData: Partial<Article>) {
  if (articleData.id) {
    articles.value = articles.value.map((a) =>
      a.id === articleData.id ? ({ ...a, ...articleData } as Article) : a
    )
  } else {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: articleData.title || '',
      abstract: articleData.abstract || '',
      content: articleData.content || '',
      authors: articleData.authors || [],
      keywords: articleData.keywords || [],
      category: articleData.category || '',
      publishedDate: new Date().toISOString().split('T')[0],
      authorId: auth.user.value?.id || '',
      authorName: auth.user.value?.name || '',
      likes: 0,
      dislikes: 0,
    }
    articles.value.unshift(newArticle)
  }
}

// 💬 Feedbacks
function handleAddFeedback(articleId: string, comment: string) {
  const newFeedback: Feedback = {
    id: Date.now().toString(),
    articleId,
    userId: auth.user.value?.id || '',
    userName: auth.user.value?.name || '',
    comment,
    createdAt: new Date().toISOString(),
  }
  feedbacks.value.push(newFeedback)
}

const articleFeedbacks = computed(() =>
  selectedArticle.value
    ? feedbacks.value.filter((f) => f.articleId === selectedArticle.value?.id)
    : []
)

// 🔍 Detalhes e edição
function handleViewDetails(article: Article) {
  selectedArticle.value = article
  detailsOpen.value = true
}

function handleEditArticle(article: Article) {
  editingArticle.value = article
  articleFormOpen.value = true
}

function handleNewArticle() {
  editingArticle.value = null
  articleFormOpen.value = true
}
</script>
