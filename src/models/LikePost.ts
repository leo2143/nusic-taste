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
