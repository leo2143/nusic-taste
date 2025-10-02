/**
 * Interface para la tabla likes_posts
 * Representa un like de un usuario a un post
 */
export interface LikePost {
  /** ID único del like (clave primaria) */
  id: number
  /** Fecha de creación del like */
  created_at: string
  /** ID del usuario que dio el like (clave foránea) */
  user_id: string
  /** ID del post que recibió el like (clave foránea) */
  post_id: number
}

/**
 * Interface para crear un nuevo like a un post
 * Excluye campos que se generan automáticamente
 */
export interface CreateLikePost {
  user_id: string
  post_id: number
}

/**
 * Interface para actualizar un like existente
 * Todos los campos son opcionales excepto el ID
 */
export interface UpdateLikePost {
  id: number
  user_id?: string
  post_id?: number
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
    name: string
    last_name: string
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
  }
}

/**
 * Interface para un like con información completa
 * Incluye datos del usuario y del post
 */
export interface LikePostWithDetails extends LikePost {
  user?: {
    id: number
    name: string
    last_name: string
    nick_name: string
  }
  post?: {
    id: number
    description: string
    img_path: string
  }
}
