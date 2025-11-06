// src/types/index.ts

export interface User {
  id: string
  name: string
  email: string
  institution?: string
  avatar?: string
}

export interface Article {
  id: string
  title: string
  abstract: string
  content: string
  authors: string[]
  keywords: string[]
  category: string
  publishedDate: string
  authorId: string
  authorName: string
  likes: number
  dislikes: number
  userVote?: 'like' | 'dislike' | null
}

export interface Feedback {
  id: string
  articleId: string
  userId: string
  userName: string
  userAvatar?: string
  comment: string
  createdAt: string
}
