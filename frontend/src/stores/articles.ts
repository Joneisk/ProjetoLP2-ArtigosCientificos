import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Article {
  id: string;
  title: string;
  abstract: string;
  content: string;
  category: string;
  authors: string[];
  date: string;
  keywords?: string[];
  likes?: number;
  dislikes?: number;
  userVote?: 'like' | 'dislike' | null;
}

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[]>([
    {
      id: '1',
      title: 'Inteligência Artificial e Machine Learning',
      abstract: 'Uma análise aprofundada sobre os avanços recentes em IA',
      content: 'Conteúdo completo do artigo...',
      category: 'Tecnologia',
      authors: ['João Silva'],
      date: '2024-11-10',
      keywords: ['IA', 'Machine Learning'],
      likes: 15,
      dislikes: 2,
      userVote: null,
    },
    {
      id: '2',
      title: 'Sustentabilidade e Energias Renováveis',
      abstract: 'Estudo sobre o impacto das energias limpas',
      content: 'Conteúdo completo do artigo...',
      category: 'Meio Ambiente',
      authors: ['Maria Santos'],
      date: '2024-11-09',
      keywords: ['Energia', 'Sustentabilidade'],
      likes: 8,
      dislikes: 1,
      userVote: null,
    },
      {
        id: '3',
        title: 'Computação Quântica: Uma Nova Era da Tecnologia',
        abstract: 'Uma análise abrangente sobre o estado atual da computação quântica',
        content: 'Conteúdo completo do artigo...',
        category: 'Física',
        authors: ['Prof. Carlos Mendes'],
        date: '2024-11-08',
        keywords: ['Computação Quântica', 'Física', 'Tecnologia', 'Qubits'],
        likes: 22,
        dislikes: 3,
        userVote: null,
      },
      {
        id: '4',
        title: 'Mudanças Climáticas e Biodiversidade: Um Estudo Global',
        abstract: 'Investigação sobre os impactos das mudanças climáticas na biodiversidade',
        content: 'Conteúdo completo do artigo...',
        category: 'Biologia',
        authors: ['Dra. Ana Paula Costa', 'Dr. Roberto Lima'],
        date: '2024-11-07',
        keywords: ['Mudanças Climáticas', 'Biodiversidade', 'Ecologia', 'Conservação'],
        likes: 18,
        dislikes: 2,
        userVote: null,
      },
      {
        id: '5',
        title: 'Aplicações de IA em Medicina Moderna',
        abstract: 'Estudo das aplicações práticas de inteligência artificial em diagnósticos',
        content: 'Conteúdo completo do artigo...',
        category: 'Medicina',
        authors: ['Dr. Paulo Santos'],
        date: '2024-11-06',
        keywords: ['IA', 'Medicina', 'Diagnóstico', 'Saúde'],
        likes: 31,
        dislikes: 1,
        userVote: null,
      },
  ]);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchArticles = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('http://localhost:3000/api/articles');
      if (!response.ok) {
        throw new Error('Falha ao carregar artigos');
      }
      const data = await response.json();
      articles.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido';
    } finally {
      isLoading.value = false;
    }
  };

  const createArticle = async (article: Omit<Article, 'id' | 'date'>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('http://localhost:3000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar artigo');
      }

      const newArticle = await response.json();
      articles.value.unshift(newArticle);
      return newArticle;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteArticle = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`http://localhost:3000/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar artigo');
      }

      articles.value = articles.value.filter(a => a.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const searchArticles = (query: string) => {
    return articles.value.filter(
      article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.abstract.toLowerCase().includes(query.toLowerCase()) ||
        article.keywords?.some(k => k.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filterByCategory = (category: string) => {
    return articles.value.filter(article => article.category === category);
  };

  const toggleLike = (articleId: string) => {
    const article = articles.value.find(a => a.id === articleId);
    if (article) {
      if (article.userVote === 'like') {
        article.userVote = null;
        article.likes = (article.likes || 0) - 1;
      } else {
        if (article.userVote === 'dislike') {
          article.dislikes = (article.dislikes || 0) - 1;
        }
        article.userVote = 'like';
        article.likes = (article.likes || 0) + 1;
      }
    }
  };

  const toggleDislike = (articleId: string) => {
    const article = articles.value.find(a => a.id === articleId);
    if (article) {
      if (article.userVote === 'dislike') {
        article.userVote = null;
        article.dislikes = (article.dislikes || 0) - 1;
      } else {
        if (article.userVote === 'like') {
          article.likes = (article.likes || 0) - 1;
        }
        article.userVote = 'dislike';
        article.dislikes = (article.dislikes || 0) + 1;
      }
    }
  };

  const getFeedbacksByArticle = (articleId: string) => {
    // Retorna array vazio por enquanto - será implementado com backend
    return [];
  };

  const addArticle = (article: Omit<Article, 'id'>, userId: string, userName: string) => {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
    };
    articles.value.unshift(newArticle);
  };

  const updateArticle = (articleId: string, updates: Partial<Article>) => {
    const article = articles.value.find(a => a.id === articleId);
    if (article) {
      Object.assign(article, updates);
    }
  };

  const addFeedback = (articleId: string, userId: string, userName: string, comment: string) => {
    // Será implementado com backend
    console.log('Feedback adicionado:', { articleId, userId, userName, comment });
  };

  return {
    articles,
    isLoading,
    error,
    fetchArticles,
    createArticle,
    deleteArticle,
    searchArticles,
    filterByCategory,
    toggleLike,
    toggleDislike,
    getFeedbacksByArticle,
    addArticle,
    updateArticle,
    addFeedback,
  };
});
