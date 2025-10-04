/**
 * Interface para la tabla like_posts
 * Representa un like a un post en el sistema
 */
export interface LikePost {
  /** ID único del like (clave primaria) */
  id: number
  /** Fecha de creación del like */
  created_at: string
  /** ID del post que se le dio like (clave foránea) */
  post_id: number
  /** ID del usuario que dio el like (clave foránea) */
  user_id: string
}

/**
 * Interface para crear un nuevo like de post
 * Excluye campos que se generan automáticamente
 */
export interface CreateLikePost {
  post_id: number
  user_id: string
}

/**
 * Interface para actualizar un like de post existente
 * Todos los campos son opcionales excepto el ID
 */
export interface UpdateLikePost {
  id: number
  post_id?: number
  user_id?: string
}

/**
 * Interface para la respuesta de la API de likes de posts
 */
export interface LikePostResponse {
  data: LikePost | null
  error: string | null
  loading: boolean
}

/**
 * Interface para la respuesta de la API de lista de likes de posts
 */
export interface LikePostsResponse {
  data: LikePost[] | null
  error: string | null
  loading: boolean
}

/**
 * Interface para un like con información del usuario
 * Útil para mostrar likes con datos del usuario
 */
export interface LikePostWithUser extends LikePost {
  user?: {
    id: number
    complete_name: string
    nick_name: string
  }
}

/**
 * Interface para un like con información del post
 * Útil para mostrar likes con datos del post
 */
export interface LikePostWithPost extends LikePost {
  post?: {
    id: number
    description: string
    img_path: string
    likes: number
    user_id: string
  }
}

/**
 * Interface para un like con información completa
 * Incluye datos del usuario y del post
 */
export interface LikePostWithDetails extends LikePost {
  user?: {
    id: number
    complete_name: string
    nick_name: string
    profile_image: string
  }
  post?: {
    id: number
    description: string
    img_path: string
    likes: number
    user_id: string
  }
}