/**
 * Servicio para manejo de usuarios
 * Proporciona métodos para operaciones CRUD de usuarios
 */
import supabase from '@/lib/supabaseClient'
import type { CreateUser, UpdateUser, UserResponse, UsersResponse } from '@/models'

export class UserService {

  /**
   * Obtener todos los usuarios (para administración)
   * @returns Promise<UsersResponse>
   */
  static async getAllUsers(): Promise<UsersResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return {
          data: [],
          error: error.message,
          loading: false
        }
      }

      return {
        data: data || [],
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Error desconocido al obtener usuarios',
        loading: false
      }
    }
  }

  /**
   * Crear un nuevo usuario
   * @param userData - Datos del usuario a crear
   * @returns Promise<UserResponse>
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
        data: data,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al crear usuario',
        loading: false
      }
    }
  }

  /**
   * Eliminar un usuario por ID
   * @param userId - ID del usuario a eliminar
   * @returns Promise<UserResponse>
   */
  static async deleteUser(userId: string): Promise<UserResponse> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      return {
        data: null,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al eliminar usuario',
        loading: false
      }
    }
  }

  /**
   * Obtener un usuario por nick_name
   * @param nick_name - Nick name del usuario
   * @returns Promise<UserResponse>
   */
  static async getUserByNickName(nick_name: string): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nick_name', nick_name)
        .maybeSingle()

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      // Si no se encuentra el usuario, devolver null sin error
      if (!data) {
        return {
          data: null,
          error: null,
          loading: false
        }
      }

      return {
        data: data,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al obtener usuario',
        loading: false
      }
    }
  }

  /**
   * Obtener un usuario por email
   * @param email - Email del usuario
   * @returns Promise<UserResponse>
   */
  static async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (error) {
        return {
          data: null,
          error: error.message,
          loading: false
        }
      }

      // Si no se encuentra el usuario, devolver null sin error
      if (!data) {
        return {
          data: null,
          error: null,
          loading: false
        }
      }

      return {
        data: data,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al obtener usuario',
        loading: false
      }
    }
  }

  /**
   * Actualizar un usuario existente
   * @param id - ID del usuario a actualizar
   * @param userData - Datos del usuario a actualizar
   * @returns Promise<UserResponse>
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
        data: data,
        error: null,
        loading: false
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido al actualizar usuario',
        loading: false
      }
    }
  }



  /**
   * Verificar si un nick_name ya existe
   * @param nickName - Nick name a verificar
   * @returns Promise<{ exists: boolean; error: string | null }>
   */
  static async checkNicknameExists(nickName: string): Promise<{ exists: boolean; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('nick_name')
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
    } catch (err) {
      return {
        exists: false,
        error: err instanceof Error ? err.message : 'Error desconocido al verificar nick name'
      }
    }
  }

}