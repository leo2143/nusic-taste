/**
 * Exportaciones centralizadas de todas las interfaces del modelo de datos
 * Este archivo facilita la importación de interfaces en otros archivos del proyecto
 */

// Interfaces de Usuario
export type {
  User,
  CreateUser,
  UpdateUser,
  UserResponse,
  UsersResponse
} from './User'

// Interfaces de Post
export type {
  Post,
  CreatePost,
  UpdatePost,
  PostResponse,
  PostsResponse,
  PostWithUser
} from './Post'

// Interfaces de Comentario
export type {
  Comment,
  CreateComment,
  UpdateComment,
  CommentResponse,
  CommentsResponse,
  CommentWithUser,
  CommentWithPost,
  CommentWithDetails
} from './Comment'

// Interfaces de Likes de Posts
export type {
  LikePost,
  CreateLikePost,
  UpdateLikePost,
  LikePostResponse,
  LikePostsResponse,
  LikePostWithUser,
  LikePostWithPost,
  LikePostWithDetails
} from './LikePost'

// Interfaces de Likes de Comentarios
export type {
  LikeComment,
  CreateLikeComment,
  UpdateLikeComment,
  LikeCommentResponse,
  LikeCommentsResponse,
  LikeCommentWithUser,
  LikeCommentWithComment,
  LikeCommentWithDetails
} from './LikeComment'

/**
 * Tipos de utilidad para operaciones comunes
 */

// Tipo para operaciones CRUD genéricas
export type CrudOperation = 'create' | 'read' | 'update' | 'delete'

// Tipo para estados de carga
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Tipo para respuestas de API genéricas
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

// Tipo para respuestas de API con paginación
export interface PaginatedResponse<T> {
  data: T[]
  error: string | null
  loading: boolean
  count: number
  page: number
  limit: number
  hasMore: boolean
}

/**
 * Tipos para filtros y búsquedas
 */

// Filtros para usuarios
export interface UserFilters {
  complete_name?: string
  email?: string
  nick_name?: string
  gender?: string
  age_min?: number
  age_max?: number
}

// Filtros para posts
export interface PostFilters {
  description?: string
  likes_min?: number
  likes_max?: number
  created_after?: string
  created_before?: string
}

// Filtros para comentarios
export interface CommentFilters {
  post_id?: number
  user_id?: string
  created_after?: string
  created_before?: string
}

// Filtros para likes de posts
export interface LikePostFilters {
  user_id?: string
  post_id?: number
  created_after?: string
  created_before?: string
}

// Filtros para likes de comentarios
export interface LikeCommentFilters {
  user_id?: string
  comment_id?: number
  created_after?: string
  created_before?: string
}

/**
 * Tipos para ordenamiento
 */
export type SortOrder = 'asc' | 'desc'

export interface SortOptions {
  field: string
  order: SortOrder
}