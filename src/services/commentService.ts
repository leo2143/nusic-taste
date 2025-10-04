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
          complete_name,
          nick_name,
          profile_image
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });




        
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

}
