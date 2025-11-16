// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  institution?: string;
  avatar?: string;
}

export interface Article {
  id: string;
  title: string;
  abstract: string;
  content: string;
  authors: string[];
  keywords: string[];
  category: string;
  categoryName?: string;
  date: string;
  authorId?: string;
  authorName?: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
  feedbackCount?: number;
}

export interface Feedback {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  nome: string;
  descricao?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleFormData {
  title: string;
  category: string;
  abstract: string;
  content: string;
  authors: string;
  keywords: string;
}