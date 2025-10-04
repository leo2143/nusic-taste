/**
 * Interface para la tabla like_comments
 * Representa un like a un comentario en el sistema
 */
export interface LikeComment {
  /** ID único del like (clave primaria) */
  id: number
  /** Fecha de creación del like */
  created_at: string
  /** ID del comentario que se le dio like (clave foránea) */
  comment_id: number
  /** ID del usuario que dio el like (clave foránea) */
  user_id: string
}

/**
 * Interface para crear un nuevo like de comentario
 * Excluye campos que se generan automáticamente
 */
export interface CreateLikeComment {
  comment_id: number
  user_id: string
}

/**
 * Interface para actualizar un like de comentario existente
 * Todos los campos son opcionales excepto el ID
 */
export interface UpdateLikeComment {
  id: number
  comment_id?: number
  user_id?: string
}

/**
 * Interface para la respuesta de la API de likes de comentarios
 */
export interface LikeCommentResponse {
  data: LikeComment | null
  error: string | null
  loading: boolean
}

/**
 * Interface para la respuesta de la API de lista de likes de comentarios
 */
export interface LikeCommentsResponse {
  data: LikeComment[] | null
  error: string | null
  loading: boolean
}

/**
 * Interface para un like con información del usuario
 * Útil para mostrar likes con datos del usuario
 */
export interface LikeCommentWithUser extends LikeComment {
  user?: {
    id: number
    complete_name: string
    nick_name: string
  }
}

/**
 * Interface para un like con información del comentario
 * Útil para mostrar likes con datos del comentario
 */
export interface LikeCommentWithComment extends LikeComment {
  comment?: {
    id: number
    comment: string
    post_id: number
    user_id: string
  }
}

/**
 * Interface para un like con información completa
 * Incluye datos del usuario y del comentario
 */
export interface LikeCommentWithDetails extends LikeComment {
  user?: {
    id: number
    complete_name: string
    nick_name: string
    profile_image: string
  }
  comment?: {
    id: number
    comment: string
    post_id: number
    user_id: string
  }
}