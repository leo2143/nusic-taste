/**
 * Servicio para manejar operaciones CRUD de comentarios
 * Utiliza Supabase para las operaciones de base de datos
 */
import supabase from '@/lib/supabaseClient.js'
import type { 
  Comment, 
  CreateComment, 
  UpdateComment, 
  CommentResponse, 
  CommentsResponse,
  CommentWithUser,
  CommentWithPost,
  CommentWithDetails,
  CommentFilters 
} from '@/models'

export class CommentService {
  /**
   * Obtener todos los comentarios
   */
  static async getAllComments(filters?: CommentFilters): Promise<CommentsResponse> {
    try {
      let query = supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.post_id) {
          query = query.eq('post_id', filters.post_id)
        }
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id)
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
        data: data as Comment[],
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
   * Obtener comentarios con información del usuario
   */
  static async getCommentsWithUser(filters?: CommentFilters): Promise<CommentsResponse> {
    try {
      let query = supabase
        .from('comments')
        .select(`
          *,
          user:users!comments_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          )
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.post_id) {
          query = query.eq('post_id', filters.post_id)
        }
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id)
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
        data: data as CommentWithUser[],
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
   * Obtener comentarios con información completa (usuario y post)
   */
  static async getCommentsWithDetails(filters?: CommentFilters): Promise<CommentsResponse> {
    try {
      let query = supabase
        .from('comments')
        .select(`
          *,
          user:users!comments_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          ),
          post:posts!comments_post_id_fkey (
            id,
            description,
            img_path
          )
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.post_id) {
          query = query.eq('post_id', filters.post_id)
        }
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id)
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
        data: data as CommentWithDetails[],
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
   * Obtener comentarios por post
   */
  static async getCommentsByPost(postId: number): Promise<CommentsResponse> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:users!comments_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as CommentWithUser[],
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
   * Obtener comentarios por usuario
   */
  static async getCommentsByUser(userId: string): Promise<CommentsResponse> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          post:posts!comments_post_id_fkey (
            id,
            description,
            img_path
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
        data: data as CommentWithPost[],
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
   * Obtener un comentario por ID
   */
  static async getCommentById(id: number): Promise<CommentResponse> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as Comment,
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
   * Crear un nuevo comentario
   */
  static async createComment(commentData: CreateComment): Promise<CommentResponse> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
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
        data: data as Comment,
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
   * Actualizar un comentario existente
   */
  static async updateComment(id: number, commentData: UpdateComment): Promise<CommentResponse> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update(commentData)
        .eq('id', id)
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
        data: data as Comment,
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
   * Eliminar un comentario
   */
  static async deleteComment(id: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('comments')
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

  /**
   * Incrementar likes de un comentario
   */
  static async incrementLikes(id: number): Promise<CommentResponse> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ likes: supabase.raw('likes + 1') })
        .eq('id', id)
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
        data: data as Comment,
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
   * Decrementar likes de un comentario
   */
  static async decrementLikes(id: number): Promise<CommentResponse> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ likes: supabase.raw('likes - 1') })
        .eq('id', id)
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
        data: data as Comment,
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
}
