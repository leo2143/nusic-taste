/**
 * Servicio para manejar operaciones CRUD de likes de comentarios
 * Utiliza Supabase para las operaciones de base de datos
 */
import supabase from '@/lib/supabaseClient.js'
import type { 
  LikeComment, 
  CreateLikeComment, 
  UpdateLikeComment, 
  LikeCommentResponse, 
  LikeCommentsResponse,
  LikeCommentWithUser,
  LikeCommentWithComment,
  LikeCommentWithDetails,
  LikeCommentFilters 
} from '@/models'

export class LikeCommentService {
  /**
   * Obtener todos los likes de comentarios
   */
  static async getAllLikeComments(filters?: LikeCommentFilters): Promise<LikeCommentsResponse> {
    try {
      let query = supabase
        .from('likes_comments')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id)
        }
        if (filters.comment_id) {
          query = query.eq('comment_id', filters.comment_id)
        }
        if (filters.created_after) {
          query = query.gte('created_at', filters.created_after)
        }
        if (filters.created_before) {
          query = query.lte('created_at', filters.created_before)
        }
      }

      const { data, error } = await query

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as LikeComment[],
        error: null,
        loading: false
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false
      }
    }
  }

  /**
   * Obtener likes de comentarios con información del usuario
   */
  static async getLikeCommentsWithUser(filters?: LikeCommentFilters): Promise<LikeCommentsResponse> {
    try {
      let query = supabase
        .from('likes_comments')
        .select(`
          *,
          user:users!likes_comments_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          )
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id)
        }
        if (filters.comment_id) {
          query = query.eq('comment_id', filters.comment_id)
        }
        if (filters.created_after) {
          query = query.gte('created_at', filters.created_after)
        }
        if (filters.created_before) {
          query = query.lte('created_at', filters.created_before)
        }
      }

      const { data, error } = await query

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as LikeCommentWithUser[],
        error: null,
        loading: false
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false
      }
    }
  }

  /**
   * Obtener likes de comentarios con información completa (usuario y comentario)
   */
  static async getLikeCommentsWithDetails(filters?: LikeCommentFilters): Promise<LikeCommentsResponse> {
    try {
      let query = supabase
        .from('likes_comments')
        .select(`
          *,
          user:users!likes_comments_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          ),
          comment:comments!likes_comments_comment_id_fkey (
            id,
            comment,
            post_id
          )
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id)
        }
        if (filters.comment_id) {
          query = query.eq('comment_id', filters.comment_id)
        }
        if (filters.created_after) {
          query = query.gte('created_at', filters.created_after)
        }
        if (filters.created_before) {
          query = query.lte('created_at', filters.created_before)
        }
      }

      const { data, error } = await query

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as LikeCommentWithDetails[],
        error: null,
        loading: false
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false
      }
    }
  }

  /**
   * Obtener likes por usuario
   */
  static async getLikeCommentsByUser(userId: string): Promise<LikeCommentsResponse> {
    try {
      const { data, error } = await supabase
        .from('likes_comments')
        .select(`
          *,
          comment:comments!likes_comments_comment_id_fkey (
            id,
            comment,
            post_id
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as LikeCommentWithComment[],
        error: null,
        loading: false
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false
      }
    }
  }

  /**
   * Obtener likes por comentario
   */
  static async getLikeCommentsByComment(commentId: number): Promise<LikeCommentsResponse> {
    try {
      const { data, error } = await supabase
        .from('likes_comments')
        .select(`
          *,
          user:users!likes_comments_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          )
        `)
        .eq('comment_id', commentId)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as LikeCommentWithUser[],
        error: null,
        loading: false
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false
      }
    }
  }

  /**
   * Verificar si un usuario ya le dio like a un comentario
   */
  static async checkUserLikedComment(userId: string, commentId: number): Promise<{ liked: boolean; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('likes_comments')
        .select('id')
        .eq('user_id', userId)
        .eq('comment_id', commentId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return {
          liked: false,
          error: error.message
        }
      }

      return {
        liked: !!data,
        error: null
      }
    } catch (error) {
      return {
        liked: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Contar likes de un comentario
   */
  static async countLikesByComment(commentId: number): Promise<{ count: number; error: string | null }> {
    try {
      const { count, error } = await supabase
        .from('likes_comments')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId)

      if (error) {
        return {
          count: 0,
          error: error.message
        }
      }

      return {
        count: count || 0,
        error: null
      }
    } catch (error) {
      return {
        count: 0,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Dar like a un comentario
   */
  static async likeComment(likeData: CreateLikeComment): Promise<LikeCommentResponse> {
    try {
      // Verificar si ya existe el like
      const { liked, error: checkError } = await this.checkUserLikedComment(likeData.user_id, likeData.comment_id)
      
      if (checkError) {
        return {
          data: null,
          error: checkError,
          loading: false
        }
      }

      if (liked) {
        return {
          data: null,
          error: 'El usuario ya le dio like a este comentario',
          loading: false
        }
      }

      const { data, error } = await supabase
        .from('likes_comments')
        .insert([likeData])
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as LikeComment,
        error: null,
        loading: false
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false
      }
    }
  }

  /**
   * Quitar like de un comentario
   */
  static async unlikeComment(userId: string, commentId: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('likes_comments')
        .delete()
        .eq('user_id', userId)
        .eq('comment_id', commentId)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        error: null
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Toggle like (dar o quitar like)
   */
  static async toggleLikeComment(userId: string, commentId: number): Promise<{ liked: boolean; error: string | null }> {
    try {
      const { liked, error: checkError } = await this.checkUserLikedComment(userId, commentId)
      
      if (checkError) {
        return {
          liked: false,
          error: checkError
        }
      }

      if (liked) {
        // Quitar like
        const { success, error } = await this.unlikeComment(userId, commentId)
        return {
          liked: false,
          error: error
        }
      } else {
        // Dar like
        const { data, error } = await this.likeComment({ user_id: userId, comment_id: commentId })
        return {
          liked: !error,
          error: error
        }
      }
    } catch (error) {
      return {
        liked: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Eliminar un like por ID
   */
  static async deleteLikeComment(id: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('likes_comments')
        .delete()
        .eq('id', id)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        error: null
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
}
