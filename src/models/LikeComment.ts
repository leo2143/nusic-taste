/**
 * Interface para la tabla likes_comments
 * Representa un like de un usuario a un comentario
 */
export interface LikeComment {
  /** ID único del like (clave primaria) */
  id: number
  /** Fecha de creación del like */
  created_at: string
  /** ID del usuario que dio el like (clave foránea) */
  user_id: string
  /** ID del comentario que recibió el like (clave foránea) */
  comment_id: number
}

/**
 * Interface para crear un nuevo like a un comentario
 * Excluye campos que se generan automáticamente
 */
export interface CreateLikeComment {
  user_id: string
  comment_id: number
}

/**
 * Interface para actualizar un like existente
 * Todos los campos son opcionales excepto el ID
 */
export interface UpdateLikeComment {
  id: number
  user_id?: string
  comment_id?: number
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
    name: string
    last_name: string
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
  }
}

/**
 * Interface para un like con información completa
 * Incluye datos del usuario y del comentario
 */
export interface LikeCommentWithDetails extends LikeComment {
  user?: {
    id: number
    name: string
    last_name: string
    nick_name: string
  }
  comment?: {
    id: number
    comment: string
    post_id: number
  }
}
