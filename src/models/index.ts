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
  CommentResponse,
  CommentsResponse,
  CommentWithUser
} from './Comment'

// Interfaces de Likes de Posts
export type {
  LikePost
} from './LikePost'
