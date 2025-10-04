/**
 * Servicio para manejar operaciones CRUD de likes de posts
 * Utiliza Supabase para las operaciones de base de datos
 */
import supabase from '@/lib/supabaseClient'
import type { 
} from '@/models'

export class LikePostService {

  /**
   * Verificar si un usuario ya le dio like a un post
   */
  static async checkUserLikedPost(userId: string, postId: number): Promise<{ liked: boolean; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('likes_posts')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .maybeSingle()

      if (error) {
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
   * Contar likes de un post
   */
  static async countLikesByPost(postId: number): Promise<{ count: number; error: string | null }> {
    try {
      const { count, error } = await supabase
        .from('likes_posts')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)

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
   * Contar likes de un post por id
   */
  static async countLikesByPosts(postIds: number[]): Promise<{ counts: Record<number, number>; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('likes_posts')
        .select('post_id')
        .in('post_id', postIds)

      if (error) {
        return {
          counts: {},
          error: error.message
        }
      }

      // Contar likes por post
      const counts = data?.reduce((acc, like) => {
        acc[like.post_id] = (acc[like.post_id] || 0) + 1
        return acc
      }, {} as Record<number, number>) || {}

      return {
        counts,
        error: null
      }
    } catch (error) {
      return {
        counts: {},
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }


  /**
   * Toggle like (dar o quitar like)
   */
  static async toggleLikePost(userId: string, postId: number): Promise<{ liked: boolean; error: string | null }> {
    try {
      const { liked, error: checkError } = await this.checkUserLikedPost(userId, postId)
      
      if (checkError) {
        return {
          liked: false,
          error: checkError
        }
      }

      if (liked) {
        // Quitar like
        const { error } = await supabase
          .from('likes_posts')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId)

        if (error) {
          return {
            liked: false,
            error: error.message
          }
        }

        return {
          liked: false,
          error: null
        }
      } else {
        // Dar like
        const { error } = await supabase
          .from('likes_posts')
          .insert([{ user_id: userId, post_id: postId }])

        if (error) {
          return {
            liked: false,
            error: error.message
          }
        }

        return {
          liked: true,
          error: null
        }
      }
    } catch (error) {
      return {
        liked: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

}
