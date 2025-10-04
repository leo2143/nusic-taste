/**
 * Interface para la tabla comments
 * Representa un comentario en el sistema
 */
export interface Comment {
  /** ID único del comentario (clave primaria) */
  id: number
  /** Fecha de creación del comentario */
  created_at: string
  /** Contenido del comentario */
  comment: string
  /** ID del post al que pertenece el comentario (clave foránea) */
  post_id: number
  /** ID del usuario que hizo el comentario (clave foránea) */
  user_id: string
}

/**
 * Interface para crear un nuevo comentario
 * Excluye campos que se generan automáticamente
 */
export interface CreateComment {
  comment: string
  post_id: number
  user_id: string
}


/**
 * Interface para la respuesta de la API de comentarios
 */
export interface CommentResponse {
  data: Comment | null
  error: string | null
  loading: boolean
}

/**
 * Interface para la respuesta de la API de lista de comentarios
 */
export interface CommentsResponse {
  data: Comment[] | null
  error: string | null
  loading: boolean
}

/**
 * Interface para un comentario con información del usuario
 * Útil para mostrar comentarios con datos del autor
 */
export interface CommentWithUser extends Comment {
  user?: {
    id: number
    complete_name: string
    nick_name: string
    profile_image: string
  }
}
