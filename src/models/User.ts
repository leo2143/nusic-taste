/**
 * Interface para la tabla users
 * Representa un usuario en el sistema
 */
export interface User {
  id: number

  name: string
  last_name: string
  email: string
  nick_name: string
  age: number
  gender: string
  user_id: string
  profile_image: string
}

/**
 * Interface para crear un nuevo usuario
 * Excluye campos que se generan automáticamente
 */
export interface CreateUser {
  name: string
  last_name: string
  email: string
  nick_name: string
  age: number
  gender: string
  user_id: string
  profile_image: string
}

/**
 * Interface para actualizar un usuario existente
 * Todos los campos son opcionales excepto el ID
 */
export interface UpdateUser {
  id: number
  name?: string
  last_name?: string
  email?: string
  nick_name?: string
  age?: number
  gender?: string
  user_id?: string
  profile_image?: string
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
