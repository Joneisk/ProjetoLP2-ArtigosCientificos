import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { User, Article, Feedback, ArticleFormData, Category } from '@/types';

const API_BASE_URL = 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar token ao header se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função para mapear artigo do backend para frontend
const mapArticleFromBackend = (backendArticle: any): Article => {
  const feedbackCount = backendArticle.feedbacks?.length || 0;
  return {
    id: backendArticle._id || backendArticle.id,
    title: backendArticle.titulo,
    abstract: backendArticle.resumo,
    content: backendArticle.conteudo,
    authors: backendArticle.autores || [],
    keywords: backendArticle.palavrasChave || [],
    category: backendArticle.categoria?._id || backendArticle.categoria,
    categoryName: backendArticle.categoria?.nome || 'Sem categoria',
    date: backendArticle.dataPublicacao || backendArticle.createdAt,
    authorId: backendArticle.autorId,
    authorName: backendArticle.autorNome,
    likes: backendArticle.curtidas || 0,
    dislikes: backendArticle.descurtidas || 0,
    userVote: null,
    feedbackCount,
  };
};

// ============ AUTH ============
export const authAPI = {
  register: async (nome: string, email: string, senha: string, instituicao?: string) => {
    const response = await api.post('/login/register', {
      nome,
      email,
      senha,
      instituicao: instituicao || null,
    });
    return response.data;
  },

  login: async (email: string, senha: string) => {
    const response = await api.post('/login/login', { email, senha });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  resetPassword: async (email: string, senhaAtual: string, senhaNova: string) => {
    const response = await api.post('/login/reset-password', {
      email,
      senhaAtual,
      senhaNova,
    });
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ============ CATEGORIAS ============
export const categoriaAPI = {
  getAll: async () => {
    const response = await api.get('/categoria/list');
    return response.data.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get(`/categoria/get/${id}`);
    return response.data.data;
  },

  create: async (nome: string, descricao?: string, adminEmail?: string) => {
    const payload: any = { nome };
    if (descricao !== undefined) payload.descricao = descricao;
    if (adminEmail) payload.adminEmail = adminEmail;
    const response = await api.post('/categoria/create', payload);
    return response.data.data;
  },

  update: async (id: string, nome: string, descricao?: string) => {
    const response = await api.put(`/categoria/update/${id}`, { nome, descricao });
    return response.data.data;
  },

  delete: async (id: string, adminEmail?: string) => {
    if (adminEmail) {
      // axios allows sending a body with delete via the `data` config
      await api.delete(`/categoria/delete/${id}`, { data: { adminEmail } });
    } else {
      await api.delete(`/categoria/delete/${id}`);
    }
  },
};

// ============ ARTIGOS ============
export const artigoAPI = {
  getAll: async () => {
    const response = await api.get('/artigo/list');
    const articles = response.data.data || [];
    return articles.map(mapArticleFromBackend);
  },

  getById: async (id: string) => {
    const response = await api.get(`/artigo/get/${id}`);
    return mapArticleFromBackend(response.data.data);
  },

  getByCategoria: async (categoriaId: string) => {
    const response = await api.get(`/artigo/categoria/${categoriaId}`);
    const articles = response.data.data || [];
    return articles.map(mapArticleFromBackend);
  },

  create: async (data: ArticleFormData, autorId: string, autorNome: string) => {
    const response = await api.post('/artigo/register', {
      titulo: data.title,
      categoria: data.category,
      resumo: data.abstract,
      conteudo: data.content,
      autores: typeof data.authors === 'string' ? data.authors.split(',').map(a => a.trim()) : data.authors,
      palavrasChave: typeof data.keywords === 'string' ? data.keywords.split(',').map(k => k.trim()) : data.keywords,
      autorId,
      autorNome,
    });
    return mapArticleFromBackend(response.data.data);
  },

  update: async (id: string, data: Partial<ArticleFormData>) => {
    const response = await api.put(`/artigo/update/${id}`, data);
    return mapArticleFromBackend(response.data.data);
  },

  delete: async (id: string) => {
    await api.delete(`/artigo/delete/${id}`);
  },

  like: async (id: string, userId: string) => {
    const response = await api.post(`/artigo/like/${id}`, { userId });
    return response.data.data;
  },

  dislike: async (id: string, userId: string) => {
    const response = await api.post(`/artigo/dislike/${id}`, { userId });
    return response.data.data;
  },

  addFeedback: async (articleId: string, userId: string, userName: string, comment: string) => {
    const response = await api.post(`/artigo/feedback/${articleId}`, {
      userId,
      userName,
      comment,
    });
    return response.data.data;
  },

  getFeedbacks: async (articleId: string) => {
    const response = await api.get(`/artigo/feedbacks/${articleId}`);
    return response.data.data || [];
  },

  getSummary: async (articleId: string) => {
    const response = await api.post(`/artigo/resumir/${articleId}`);
    return response.data.data;
  },
};

export default api;
