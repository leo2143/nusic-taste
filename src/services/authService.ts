/**
 * Servicio de autenticación centralizado
 * Maneja toda la lógica de autenticación: login, logout, registro y verificación de sesión
 */
import supabase from '@/lib/supabaseClient'
import { UserService } from '@/services/userService'
import type { User } from '@/models'

export interface AuthResponse {
  success: boolean
  data?: any
  error?: string
  user?: User | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  nick_name: string
  complete_name: string
  password: string
  confirmPassword?: string
}

export class AuthService {
  // Constantes para validaciones
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  private static readonly NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/
  private static readonly NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/
  /**
   * Iniciar sesión con email y contraseña
   * @param credentials - Credenciales de login
   * @returns Promise<AuthResponse>
   */
  static async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message),
          user: null
        }
      }

      // Obtener datos del usuario desde la tabla users
      const userData = await this.getUserData(data.user?.email)
      
      return {
        success: true,
        data: data,
        user: userData,
        error: null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al iniciar sesión',
        user: null
      }
    }
  }

  /**
   * Registrar nuevo usuario
   * @param credentials - Credenciales de registro
   * @returns Promise<AuthResponse>
   */
  static async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message),
          user: null
        }
      }

      // Solo crear usuario en la tabla users si el registro fue exitoso
      if (data.user) {
        const { data: userData, error: userError } = await UserService.createUser({
          id: data.user.id,
          complete_name: credentials.complete_name,
          nick_name: credentials.nick_name,
          age: 0, // Se puede agregar un campo de edad si es necesario
          gender: '', // Se puede agregar un campo de género si es necesario
          profile_image: '',
          email: credentials.email,
        })

        if (userError) {
          console.error('Error creating user in database:', userError)
          // No retornamos error aquí porque el usuario ya se registró en Supabase Auth
        }
      }

      return {
        success: true,
        data: data,
        user: null,
        error: null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al registrar usuario',
        user: null
      }
    }
  }

  /**
   * Cerrar sesión
   * @returns Promise<AuthResponse>
   */
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return {
          success: false,
          error: error.message,
          user: null
        }
      }

      return {
        success: true,
        data: null,
        user: null,
        error: null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al cerrar sesión',
        user: null
      }
    }
  }

  /**
   * Verificar sesión actual y obtener datos del usuario
   * @returns Promise<AuthResponse>
   */
  static async getCurrentSession(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        return {
          success: false,
          error: error.message,
          user: null
        }
      }

      if (!session?.user) {
        return {
          success: true,
          data: null,
          user: null,
          error: null
        }
      }

      // Obtener datos del usuario desde la tabla users
      const userData = await this.getUserData(session.user.email)
      
      return {
        success: true,
        data: session,
        user: userData,
        error: null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al verificar sesión',
        user: null
      }
    }
  }

  /**
   * Obtener datos del usuario desde la tabla users
   * @param email - Email del usuario
   * @returns Promise<User | null>
   */
  static async getUserData(email?: string): Promise<User | null> {
    if (!email) return null

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error fetching user data:', err)
      return null
    }
  }

  /**
   * Escuchar cambios en el estado de autenticación
   * @param callback - Función callback para manejar cambios
   * @returns Función para desuscribirse
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }


  /**
   * Validar credenciales de login
   * @param credentials - Credenciales a validar
   * @returns object con errores de validación
   */
  static validateLoginCredentials(credentials: LoginCredentials): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!credentials.email.trim()) {
      errors.email = 'El correo electrónico es requerido'
    } else if (!this.EMAIL_REGEX.test(credentials.email)) {
      errors.email = 'Ingrese un correo electrónico válido'
    }

    if (!credentials.password) {
      errors.password = 'La contraseña es requerida'
    }

    return errors
  }

  /**
   * Validar credenciales de registro
   * @param credentials - Credenciales a validar
   * @returns object con errores de validación
   */
  static validateSignUpCredentials(credentials: SignUpCredentials): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!credentials.email.trim()) {
      errors.email = 'El correo electrónico es requerido'
    } else if (!this.EMAIL_REGEX.test(credentials.email)) {
      errors.email = 'Ingrese un correo electrónico válido'
    }

    if (!credentials.nick_name.trim()) {
      errors.nick_name = 'El nombre de usuario es requerido'
    } else if (!this.NICKNAME_REGEX.test(credentials.nick_name)) {
      errors.nick_name = 'El nombre de usuario debe tener entre 3-20 caracteres y solo puede contener letras, números y guiones bajos'
    }

    if (!credentials.complete_name.trim()) {
      errors.complete_name = 'El nombre completo es requerido'
    } else if (!this.NAME_REGEX.test(credentials.complete_name.trim())) {
      errors.complete_name = 'El nombre debe tener entre 2-50 caracteres y solo puede contener letras y espacios'
    }

    if (!credentials.password) {
      errors.password = 'La contraseña es requerida'
    } else if (credentials.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (!credentials.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña'
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    return errors
  }

  /**
   * Crear usuario desde panel de administración (sin login automático)
   * @param credentials - Credenciales del usuario
   * @returns Promise<AuthResponse>
   */
  static async createUserFromAdmin(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      // Verificar si el nickname ya existe
      if (await this.checkNicknameExists(credentials.nick_name)) {
        return {
          success: false,
          error: 'El nombre de usuario ya está en uso',
          user: null
        }
      }

      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message),
          user: null
        }
      }

      // Crear usuario en la tabla users si el registro fue exitoso
      if (data.user) {
        const { data: userData, error: userError } = await UserService.createUser({
          id: data.user.id,
          complete_name: credentials.complete_name,
          nick_name: credentials.nick_name,
          age: 0,
          gender: '',
          profile_image: '',
          email: credentials.email,
        })

        if (userError) {
          console.error('Error creating user in database:', userError)
          // No retornamos error aquí porque el usuario ya se registró en Supabase Auth
        }
      }

      return {
        success: true,
        data: data,
        user: data.user,
        error: null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al crear usuario',
        user: null
      }
    }
  }

  /**
   * Eliminar usuario desde panel de administración (elimina de Auth y tabla users)
   * @param userId - ID del usuario a eliminar
   * @returns Promise<AuthResponse>
   */
  static async deleteUserFromAdmin(userId: string): Promise<AuthResponse> {
    try {
      // Eliminar de la tabla users primero
      const userResponse = await UserService.deleteUser(userId)
      
      if (userResponse.error) {
        return {
          success: false,
          error: userResponse.error,
          user: null
        }
      }

      // Intentar eliminar de Supabase Auth (puede fallar sin permisos especiales)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId)
        if (authError) {
          console.warn('No se pudo eliminar de Auth (requiere permisos especiales):', authError)
        }
      } catch (authErr) {
        console.warn('Error al eliminar de Auth:', authErr)
      }

      return {
        success: true,
        data: null,
        user: null,
        error: null
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido al eliminar usuario',
        user: null
      }
    }
  }

  static checkNicknameExists (nick_name: string): Promise<boolean> {
    return UserService.checkNicknameExists(nick_name).then(result => result.exists)
  }

  /**
   * Convertir mensajes de error de Supabase a mensajes más amigables
   * @param errorMessage - Mensaje de error original
   * @returns string - Mensaje de error amigable
   */
  private static getErrorMessage(errorMessage: string): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Correo o contraseña incorrectos',
      'User already registered': 'El usuario ya está registrado',
      'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión',
      'Too many requests': 'Demasiados intentos. Intenta más tarde',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres'
    }

    return errorMessages[errorMessage] || errorMessage
  }
}