<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { BookOpen } from 'lucide-vue-next';
import Header from '@/components/Header.vue';
import SearchBar from '@/components/SearchBar.vue';
import ArticleCard from '@/components/ArticleCard.vue';
import LoginDialog from '@/components/LoginDialog.vue';
import RegisterDialog from '@/components/RegisterDialog.vue';
import ArticleFormDialog from '@/components/ArticleFormDialog.vue';
import ArticleDetailsDialog from '@/components/ArticleDetailsDialog.vue';
import ResetPasswordDialog from '@/components/ResetPasswordDialog.vue';
import AdminCategoryDialog from '@/components/AdminCategoryDialog.vue';
import ArticleSummaryDialog from '@/components/ArticleSummaryDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { useArticlesStore } from '@/stores/articles';
import type { Article, ArticleFormData } from '@/types';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const articlesStore = useArticlesStore();

// Estados dos modais
const loginOpen = ref(false);
const registerOpen = ref(false);
const articleFormOpen = ref(false);
const detailsOpen = ref(false);
const resetPasswordOpen = ref(false);
const adminCategoriesOpen = ref(false);
const summaryOpen = ref(false);

// Estados de busca e seleção
const searchQuery = ref('');
const category = ref('all');
const selectedArticle = ref<Article | null>(null);
const editingArticle = ref<Article | null>(null);
const selectedArticleFeedbacks = ref<any[]>([]);

// Carrega artigos e categorias ao montar o componente
onMounted(async () => {
  await articlesStore.fetchArticles();
  await articlesStore.fetchCategories();
});

// Artigos filtrados
const filteredArticles = computed(() => {
  let results = articlesStore.articles;

  // Filtro por categoria
  if (category.value !== 'all') {
    results = results.filter(a => a.category === category.value);
  }

  // Filtro por busca
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.abstract.toLowerCase().includes(query) ||
      article.keywords.some(k => k.toLowerCase().includes(query)) ||
      article.authors.some(a => a.toLowerCase().includes(query))
    );
  }

  return results;
});

// Handlers de artigos
const handleViewDetails = async (article: Article) => {
  selectedArticle.value = article;
  selectedArticleFeedbacks.value = await articlesStore.fetchFeedbacks(article.id);
  detailsOpen.value = true;
};

const handleNewArticle = () => {
  editingArticle.value = null;
  articleFormOpen.value = true;
};

const handleEditArticle = () => {
  editingArticle.value = selectedArticle.value;
  articleFormOpen.value = true;
};

const handleDeleteArticle = async () => {
  if (!selectedArticle.value) return;
  
  try {
    await articlesStore.deleteArticle(selectedArticle.value.id);
    toast.success('Artigo deletado com sucesso!');
    detailsOpen.value = false;
    selectedArticle.value = null;
  } catch (error) {
    toast.error('Erro ao deletar artigo');
    console.error(error);
  }
};

const handleSaveArticle = async (data: ArticleFormData, articleId?: string) => {
  if (!authStore.user) return;
  
  try {
    if (articleId) {
      // Editar artigo existente
      await articlesStore.updateArticle(articleId, data);
      toast.success('Artigo atualizado com sucesso!');
    } else {
      // Criar novo artigo
      await articlesStore.addArticle(data, authStore.user.id || '', authStore.user.name);
      toast.success('Artigo publicado com sucesso!');
    }
  } catch (error) {
    toast.error('Erro ao salvar artigo');
    console.error(error);
  }
};

// Handlers de votos
const handleLike = (articleId: string) => {
  if (!authStore.user) {
    toast.error('Faça login para curtir artigos');
    return;
  }
  articlesStore.toggleLike(articleId);
};

const handleDislike = (articleId: string) => {
  if (!authStore.user) {
    toast.error('Faça login para descurtir artigos');
    return;
  }
  articlesStore.toggleDislike(articleId);
};

// Handler de feedback
const handleAddFeedback = async (comment: string) => {
  if (!authStore.user || !selectedArticle.value) return;
  
  const success = await articlesStore.addFeedback(
    selectedArticle.value.id,
    authStore.user.id || '',
    authStore.user.name,
    comment
  );

  if (success) {
    toast.success('Feedback adicionado com sucesso!');
    selectedArticleFeedbacks.value = await articlesStore.fetchFeedbacks(selectedArticle.value.id);
  } else {
    toast.error('Erro ao adicionar feedback');
  }
};

// Handler para resumir artigo
const handleSummarizeArticle = () => {
  summaryOpen.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <Header
      @open-login="loginOpen = true"
      @open-register="registerOpen = true"
      @open-new-article="handleNewArticle"
      @open-reset-password="resetPasswordOpen = true"
      @open-admin-categories="adminCategoriesOpen = true"
    />

    <!-- Hero Section -->
    <section class="py-12 md:py-16 bg-gradient-to-b from-card to-background border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-3">
          SciHub Research
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Plataforma colaborativa de artigos científicos. Compartilhe conhecimento, descubra pesquisas inovadoras e conecte-se com outros pesquisadores.
        </p>
      </div>
    </section>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Barra de Pesquisa -->
      <div class="mb-8">
        <SearchBar
          v-model:search-query="searchQuery"
          v-model:category="category"
        />
      </div>

      <!-- Contador de Resultados -->
      <div class="mb-6 flex items-center justify-between">
        <p class="text-muted-foreground font-medium">
          <span class="text-foreground font-bold">{{ filteredArticles.length }}</span>
          artigo{{ filteredArticles.length !== 1 ? 's' : '' }} encontrado{{ filteredArticles.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Grid de Artigos -->
      <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <ArticleCard
          v-for="article in filteredArticles"
          :key="article.id"
          :article="article"
          @view-details="handleViewDetails(article)"
          @like="handleLike(article.id)"
          @dislike="handleDislike(article.id)"
          @summarize="selectedArticle = article; summaryOpen = true"
        />
      </div>

      <!-- Mensagem quando não há artigos -->
      <div v-else class="text-center py-16">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
          <BookOpen :size="32" class="text-muted-foreground" />
        </div>
        <p class="text-muted-foreground text-lg">
          Nenhum artigo encontrado com os critérios de busca.
        </p>
      </div>
    </main>

    <!-- Modais -->
    <LoginDialog v-model:open="loginOpen" />
    <RegisterDialog v-model:open="registerOpen" />
    <ArticleFormDialog
      v-model:open="articleFormOpen"
      :article="editingArticle"
      @save="handleSaveArticle"
    />
    <ArticleDetailsDialog
      v-model:open="detailsOpen"
      :article="selectedArticle"
      :feedbacks="selectedArticleFeedbacks"
      @like="selectedArticle && handleLike(selectedArticle.id)"
      @dislike="selectedArticle && handleDislike(selectedArticle.id)"
      @add-feedback="handleAddFeedback"
      @edit-article="handleEditArticle"
      @delete-article="handleDeleteArticle"
      @summarize="summaryOpen = true"
    />
    <ResetPasswordDialog v-model:open="resetPasswordOpen" />
    <AdminCategoryDialog v-model:open="adminCategoriesOpen" />
    <ArticleSummaryDialog 
      v-model:open="summaryOpen" 
      :article-id="selectedArticle?.id || null"
    />
  </div>
</template>