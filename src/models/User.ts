/**
 * Interface para la tabla users
 * Representa un usuario en el sistema
 */
export interface User {
  id: string
  complete_name: string
  email: string
  nick_name: string
  age: number
  gender: string
  profile_image: string
  is_admin?: boolean
}

/**
 * Interface para crear un nuevo usuario
 * Excluye campos que se generan automáticamente
 */
export interface CreateUser {
  id: string
  complete_name: string
  email: string
  nick_name: string
  age: number
  gender: string

  profile_image: string
}

/**
 * Interface para actualizar un usuario existente
 */
export interface UpdateUser {
  complete_name?: string
  email?: string
  nick_name?: string
  age?: number
  gender?: string
  profile_image?: string
  is_admin?: boolean
}

/**
 * Interface para la respuesta de la API de usuarios
 */
export interface UserResponse {
  data: User | null
  error: string | null
  loading: boolean
}

/**
 * Interface para la respuesta de la API de lista de usuarios
 */
export interface UsersResponse {
  data: User[] | null
  error: string | null
  loading: boolean
}
