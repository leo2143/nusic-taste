/**
 * Servicio para manejar operaciones CRUD de posts
 * Utiliza Supabase para las operaciones de base de datos
 */
import supabase from '@/lib/supabaseClient.js'
import type { 
  Post, 
  CreatePost, 
  UpdatePost, 
  PostResponse, 
  PostsResponse,
  PostWithUser,
  PostFilters 
} from '@/models'

export class PostService {
  /**
   * Obtener todos los posts
   */
  static async getAllPosts(filters?: PostFilters): Promise<PostsResponse> {
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.description) {
          query = query.ilike('description', `%${filters.description}%`)
        }
        if (filters.likes_min) {
          query = query.gte('likes', filters.likes_min)
        }
        if (filters.likes_max) {
          query = query.lte('likes', filters.likes_max)
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
        data: data as Post[],
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
   * Obtener posts con información del usuario
   */
  static async getPostsWithUser(filters?: PostFilters): Promise<PostsResponse> {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          user:users!posts_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          )
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.description) {
          query = query.ilike('description', `%${filters.description}%`)
        }
        if (filters.likes_min) {
          query = query.gte('likes', filters.likes_min)
        }
        if (filters.likes_max) {
          query = query.lte('likes', filters.likes_max)
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
        data: data as PostWithUser[],
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
   * Obtener un post por ID
   */
  static async getPostById(id: number): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
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
        data: data as Post,
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
   * Obtener un post por ID con información del usuario
   */
  static async getPostByIdWithUser(id: number): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users!posts_user_id_fkey (
            id,
            name,
            last_name,
            nick_name
          )
        `)
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
        data: data as PostWithUser,
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
   * Obtener posts por usuario
   */
  static async getPostsByUser(userId: string): Promise<PostsResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
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
        data: data as Post[],
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
   * Crear un nuevo post
   */
  static async createPost(postData: CreatePost): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
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
        data: data as Post,
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
   * Actualizar un post existente
   */
  static async updatePost(id: number, postData: UpdatePost): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
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
        data: data as Post,
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
   * Eliminar un post
   */
  static async deletePost(id: number): Promise<{ success: boolean; error: string | null }> {
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
   * Incrementar likes de un post
   */
  static async incrementLikes(id: number): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
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
        data: data as Post,
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
   * Decrementar likes de un post
   */
  static async decrementLikes(id: number): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
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
        data: data as Post,
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
