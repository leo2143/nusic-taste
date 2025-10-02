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
  /** Número de likes del comentario */
  likes: number
}

/**
 * Interface para crear un nuevo comentario
 * Excluye campos que se generan automáticamente
 */
export interface CreateComment {
  post_id: number
  comment: string
  user_id: string
  likes?: number
}

/**
 * Interface para actualizar un comentario existente
 * Todos los campos son opcionales excepto el ID
 */
export interface UpdateComment {
  id: number
  comment?: string
  post_id?: number
  user_id?: string
  likes?: number
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
    name: string
    last_name: string
    nick_name: string
  }
}

/**
 * Interface para un comentario con información del post
 * Útil para mostrar comentarios con datos del post
 */
export interface CommentWithPost extends Comment {
  post?: {
    id: number
    description: string
    img_path: string
  }
}

/**
 * Interface para un comentario con información completa
 * Incluye datos del usuario y del post
 */
export interface CommentWithDetails extends Comment {
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
