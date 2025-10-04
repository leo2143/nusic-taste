import type { User } from "."

/**
 * Interface para la tabla posts
 * Representa una publicación en el sistema
 */
export interface Post {
  /** ID único del post (clave primaria) */
  id: number
  /** Fecha de creación del post */
  created_at: string
  /** Descripción/contenido del post */
  description: string
  /** Ruta de la imagen asociada al post */
  img_path: string
  /** Número de likes del post */
  likes: number
  /** ID del usuario que creó el post (clave foránea) */
  user_id: string
}

/**
 * Interface para crear un nuevo post
 * Excluye campos que se generan automáticamente
 */
export interface CreatePost {
  description: string
  img_path: string
  likes?: number
  user_id: string
}

/**
 * Interface para actualizar un post existente
 * Todos los campos son opcionales excepto el ID
 */
export interface UpdatePost {
  description?: string
  img_path?: string
  likes?: number
  user_id?: string
}

/**
 * Interface para la respuesta de la API de posts
 */
export interface PostResponse {
  data: Post | null
  error: string | null
  loading: boolean
}

/**
 * Interface para la respuesta de la API de lista de posts
 */
export interface PostsResponse {
  data: PostWithUser[] | null
  error: string | null
  loading: boolean
}

/**
 * Interface para un post con información del usuario
 * Útil para mostrar posts con datos del autor
 */
export interface PostWithUser extends Post {
  user: User
}