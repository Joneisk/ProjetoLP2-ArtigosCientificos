import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { artigoAPI, categoriaAPI } from '@/services/api';
import { useAuthStore } from './auth';
import type { Article, Feedback, ArticleFormData } from '@/types';

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[]>([]);
  const categories = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  const fetchArticles = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      articles.value = await artigoAPI.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar artigos';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategories = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      categories.value = await categoriaAPI.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar categorias';
    } finally {
      isLoading.value = false;
    }
  };

  const addArticle = async (formData: ArticleFormData, userId: string, userName: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const newArticle = await artigoAPI.create(formData, userId, userName);
      articles.value.unshift(newArticle);
      return newArticle;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao adicionar artigo';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateArticle = async (articleId: string, formData: Partial<ArticleFormData>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await artigoAPI.update(articleId, formData);
      const idx = articles.value.findIndex(a => a.id === articleId);
      if (idx !== -1) {
        articles.value[idx] = updated;
      }
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar artigo';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteArticle = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await artigoAPI.delete(id);
      articles.value = articles.value.filter(a => a.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao deletar artigo';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleLike = async (articleId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;
      if (!userId) {
        error.value = 'Faça login para curtir';
        return;
      }

      const idx = articles.value.findIndex(a => a.id === articleId);
      if (idx !== -1 && articles.value[idx]) {
        const article = articles.value[idx];
        
        // Se já tinha like, remove
        if (article.userVote === 'like') {
          article.userVote = null;
          article.likes = Math.max(0, article.likes - 1);
        } else {
          // Se tinha dislike, remove e adiciona like
          if (article.userVote === 'dislike') {
            article.dislikes = Math.max(0, article.dislikes - 1);
          }
          article.userVote = 'like';
          article.likes = article.likes + 1;
        }
      }
      
      const updated = await artigoAPI.like(articleId, userId);
      if (idx !== -1 && updated && articles.value[idx]) {
        articles.value[idx].likes = (updated as any).curtidas ?? articles.value[idx].likes;
        articles.value[idx].dislikes = (updated as any).descurtidas ?? articles.value[idx].dislikes;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao curtir';
    } finally {
      isLoading.value = false;
    }
  };

  const toggleDislike = async (articleId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;
      if (!userId) {
        error.value = 'Faça login para descurtir';
        return;
      }

      const idx = articles.value.findIndex(a => a.id === articleId);
      if (idx !== -1 && articles.value[idx]) {
        const article = articles.value[idx];
        
        // Se já tinha dislike, remove
        if (article.userVote === 'dislike') {
          article.userVote = null;
          article.dislikes = Math.max(0, article.dislikes - 1);
        } else {
          // Se tinha like, remove e adiciona dislike
          if (article.userVote === 'like') {
            article.likes = Math.max(0, article.likes - 1);
          }
          article.userVote = 'dislike';
          article.dislikes = article.dislikes + 1;
        }
      }
      
      const updated = await artigoAPI.dislike(articleId, userId);
      if (idx !== -1 && updated && articles.value[idx]) {
        articles.value[idx].likes = (updated as any).curtidas ?? articles.value[idx].likes;
        articles.value[idx].dislikes = (updated as any).descurtidas ?? articles.value[idx].dislikes;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao descurtir';
    } finally {
      isLoading.value = false;
    }
  };

  const searchArticles = (query: string) => {
    if (!query.trim()) return articles.value;
    return articles.value.filter(
      article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.abstract.toLowerCase().includes(query.toLowerCase()) ||
        article.keywords?.some(k => k.toLowerCase().includes(query.toLowerCase())) ||
        article.authors.some(a => a.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filterByCategory = (categoryId: string) => {
    if (!categoryId || categoryId === 'all') return articles.value;
    return articles.value.filter(article => article.category === categoryId);
  };

  const getFeedbacksByArticle = (articleId: string): Feedback[] => {
    // Implementado no backend, será chamado via API
    return [];
  };

  const fetchFeedbacks = async (articleId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const feedbacks = await artigoAPI.getFeedbacks(articleId);
      return feedbacks;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar feedbacks';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const addFeedback = async (articleId: string, userId: string, userName: string, comment: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await artigoAPI.addFeedback(articleId, userId, userName, comment);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao adicionar feedback';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    articles,
    categories,
    isLoading,
    error,
    fetchArticles,
    fetchCategories,
    addArticle,
    updateArticle,
    deleteArticle,
    toggleLike,
    toggleDislike,
    searchArticles,
    filterByCategory,
    getFeedbacksByArticle,
    fetchFeedbacks,
    addFeedback,
  };
});
