/**
 * Servicio para manejo de posts
 * Proporciona métodos para operaciones CRUD de posts
 */
import supabase from '@/lib/supabaseClient'
import { LikePostService } from './likePostService'
import type { CreatePost, UpdatePost, PostResponse, PostsResponse, PostWithUser } from '@/models'

export class PostService {
  /**
   * Obtener todos los posts
   * @returns Promise<PostsResponse>
   */
  static async getAllPosts(): Promise<PostsResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users!posts_user_id_fkey (
            id,
            complete_name,
            nick_name,
            profile_image
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      // Obtener conteos de likes para todos los posts usando el servicio optimizado
      const postIds = (data as PostWithUser[]).map(post => post.id)
      const { counts: likesCount, error: likesError } = await LikePostService.countLikesByPosts(postIds)

      if (likesError) {
        console.warn('Error obteniendo conteos de likes:', likesError)
        // Continuar sin likes en lugar de fallar completamente
      }

      // Agregar conteo de likes a cada post
      const postsWithLikes = (data as PostWithUser[]).map(post => ({
        ...post,
        likes: likesCount[post.id] || 0
      }))

      return {
        data: postsWithLikes,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al obtener posts',
        loading: false
      }
    }
  }


  /**
   * Crear un nuevo post
   * @param postData - Datos del post a crear
   * @returns Promise<PostResponse>
   */
  static async createPost(postData: CreatePost): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select(`
          *,
          user:users!posts_user_id_fkey (
            id,
            complete_name,
            nick_name,
            profile_image
          )
        `)
        .single()

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as PostWithUser,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al crear post',
        loading: false
      }
    }
  }

  /**
   * Actualizar un post existente
   * @param id - ID del post a actualizar
   * @param postData - Datos del post a actualizar
   * @returns Promise<PostResponse>
   */
  static async updatePost(id: number, postData: UpdatePost): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id)
        .select(`
          *,
          user:users!posts_user_id_fkey (
            id,
            complete_name,
            nick_name,
            profile_image
          )
        `)
        .single()

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as PostWithUser,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al actualizar post',
        loading: false
      }
    }
  }

  /**
   * Eliminar un post
   * @param id - ID del post a eliminar
   * @returns Promise<{ success: boolean; error?: string }>
   */
  static async deletePost(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al eliminar post'
      }
    }
  }


  /**
   * Obtener posts por usuario (solo IDs de posts)
   * @param userId - ID del usuario
   * @returns Promise<PostsResponse>
   */
  static async getPostsByUserId(userId: string): Promise<PostsResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users!posts_user_id_fkey (
            id,
            complete_name,
            nick_name,
            profile_image
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

      // Obtener conteos de likes para todos los posts usando el servicio optimizado
      const postIds = (data as PostWithUser[]).map(post => post.id)
      const { counts: likesCount, error: likesError } = await LikePostService.countLikesByPosts(postIds)

      if (likesError) {
        console.warn('Error obteniendo conteos de likes:', likesError)
        // Continuar sin likes en lugar de fallar completamente
      }

      // Agregar conteo de likes a cada post
      const postsWithLikes = (data as PostWithUser[]).map(post => ({
        ...post,
        likes: likesCount[post.id] || 0
      }))

      return {
        data: postsWithLikes,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al obtener posts del usuario',
        loading: false
      }
    }
  }


}