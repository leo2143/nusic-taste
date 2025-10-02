/**
 * Servicio para manejar operaciones CRUD de usuarios
 * Utiliza Supabase para las operaciones de base de datos
 */
import supabase from '@/lib/supabaseClient.js'
import type {  User,  CreateUser,  UpdateUser,  UserResponse,  UsersResponse, UserFilters } from '@/models'

export class UserService {
  /**
   * Obtener todos los usuarios
   */
  static async getAllUsers(filters?: UserFilters): Promise<UsersResponse> {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros si existen
      if (filters) {
        if (filters.name) {
          query = query.ilike('name', `%${filters.name}%`)
        }
        if (filters.email) {
          query = query.ilike('email', `%${filters.email}%`)
        }
        if (filters.nick_name) {
          query = query.ilike('nick_name', `%${filters.nick_name}%`)
        }
        if (filters.gender) {
          query = query.eq('gender', filters.gender)
        }
        if (filters.age_min) {
          query = query.gte('age', filters.age_min)
        }
        if (filters.age_max) {
          query = query.lte('age', filters.age_max)
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
        data: data as User[],
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
   * Obtener un usuario por ID
   */
  static async getUserById(id: number): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
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
        data: data as User,
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
   * Obtener un usuario por user_id (UUID)
   */
  static async getUserByUserId(userId: string): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: data as User,
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
   * Crear un nuevo usuario
   */
  static async createUser(userData: CreateUser): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
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
        data: data as User,
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
   * Actualizar un usuario existente
   */
  static async updateUser(id: number, userData: UpdateUser): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
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
        data: data as User,
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
   * Eliminar un usuario
   */
  static async deleteUser(id: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
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
   * Verificar si un email ya existe
   */
  static async checkEmailExists(email: string): Promise<{ exists: boolean; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return {
          exists: false,
          error: error.message
        }
      }

      return {
        exists: !!data,
        error: null
      }
    } catch (error) {
      return {
        exists: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Verificar si un nickname ya existe
   */
  static async checkNicknameExists(nickName: string): Promise<{ exists: boolean; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('nick_name', nickName)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return {
          exists: false,
          error: error.message
        }
      }

      return {
        exists: !!data,
        error: null
      }
    } catch (error) {
      return {
        exists: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
}
