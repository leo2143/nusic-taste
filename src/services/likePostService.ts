/**
 * Servicio para manejar operaciones CRUD de likes de posts
 * Utiliza Supabase para las operaciones de base de datos
 */
import supabase from '@/lib/supabaseClient.js'
import type { 
  LikePost, 
  CreateLikePost, 
  UpdateLikePost, 
  LikePostResponse, 
  LikePostsResponse,
  LikePostWithUser,
  LikePostWithPost,
  LikePostWithDetails,
  LikePostFilters 
} from '@/models'

export class LikePostService {
  /**
   * Obtener todos los likes de posts
   */
  static async getAllLikePosts(filters?: LikePostFilters): Promise<LikePostsResponse> {
    try {
      let query = supabase
        .from('likes_posts')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id)
        }
        if (filters.post_id) {
          query = query.eq('post_id', filters.post_id)
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
        data: data as LikePost[],
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
   * Obtener likes de posts con información del usuario
   */
  static async getLikePostsWithUser(filters?: LikePostFilters): Promise<LikePostsResponse> {
    try {
      let query = supabase
        .from('likes_posts')
        .select(`
          *,
          user:users!likes_posts_user_id_fkey (
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
        if (filters.post_id) {
          query = query.eq('post_id', filters.post_id)
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
        data: data as LikePostWithUser[],
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
   * Obtener likes de posts con información completa (usuario y post)
   */
  static async getLikePostsWithDetails(filters?: LikePostFilters): Promise<LikePostsResponse> {
    try {
      let query = supabase
        .from('likes_posts')
        .select(`
          *,
          user:users!likes_posts_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          ),
          post:posts!likes_posts_post_id_fkey (
            id,
            description,
            img_path
          )
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id)
        }
        if (filters.post_id) {
          query = query.eq('post_id', filters.post_id)
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
        data: data as LikePostWithDetails[],
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
  static async getLikePostsByUser(userId: string): Promise<LikePostsResponse> {
    try {
      const { data, error } = await supabase
        .from('likes_posts')
        .select(`
          *,
          post:posts!likes_posts_post_id_fkey (
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
        data: data as LikePostWithPost[],
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
   * Obtener likes por post
   */
  static async getLikePostsByPost(postId: number): Promise<LikePostsResponse> {
    try {
      const { data, error } = await supabase
        .from('likes_posts')
        .select(`
          *,
          user:users!likes_posts_user_id_fkey (
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
        data: data as LikePostWithUser[],
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
   * Verificar si un usuario ya le dio like a un post
   */
  static async checkUserLikedPost(userId: string, postId: number): Promise<{ liked: boolean; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('likes_posts')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
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
   * Dar like a un post
   */
  static async likePost(likeData: CreateLikePost): Promise<LikePostResponse> {
    try {
      // Verificar si ya existe el like
      const { liked, error: checkError } = await this.checkUserLikedPost(likeData.user_id, likeData.post_id)
      
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
          error: 'El usuario ya le dio like a este post',
          loading: false
        }
      }

      const { data, error } = await supabase
        .from('likes_posts')
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
        data: data as LikePost,
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
   * Quitar like de un post
   */
  static async unlikePost(userId: string, postId: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('likes_posts')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId)

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
        const { success, error } = await this.unlikePost(userId, postId)
        return {
          liked: false,
          error: error
        }
      } else {
        // Dar like
        const { data, error } = await this.likePost({ user_id: userId, post_id: postId })
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
  static async deleteLikePost(id: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('likes_posts')
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
