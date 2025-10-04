/**
 * Composable para manejo de permisos de administrador
 * Proporciona métodos seguros para verificar si un usuario es admin
 */
import { computed, type ComputedRef } from 'vue'
import { store } from '@/lib/store'
import type { User } from '@/models'

export function useAdmin() {
  /**
   * Verifica si el usuario actual es administrador
   * @returns {ComputedRef<boolean>} true si es admin, false en caso contrario
   */
  const isAdmin: ComputedRef<boolean> = computed(() => {
    const user: User | null = store.state.user
    if (!user) return false
    
    // Verificación por campo is_admin (más seguro)
    if (user.is_admin === true) return true
    
    // Fallback: verificación por nickname (menos seguro, solo para desarrollo)
    if (user.nick_name === 'admin') return true
    
    return false
  })

  /**
   * Verifica si el usuario actual tiene permisos de administrador
   * @returns {ComputedRef<boolean>} true si tiene permisos, false en caso contrario
   */
  const hasAdminPermissions: ComputedRef<boolean> = computed(() => {
    return isAdmin.value
  })

  /**
   * Verifica si un usuario específico es administrador
   * @param {User | null} user - Usuario a verificar
   * @returns {boolean} true si es admin, false en caso contrario
   */
  const checkIfUserIsAdmin = (user: User | null): boolean => {
    if (!user) return false
    
    // Verificación por campo is_admin (más seguro)
    if (user.is_admin === true) return true
    
    // Fallback: verificación por nickname (menos seguro, solo para desarrollo)
    if (user.nick_name === 'admin') return true
    
    return false
  }

  /**
   * Requiere que el usuario sea admin, redirige si no lo es
   * @param {Function} redirectFn - Función de redirección (ej: router.push)
   * @returns {boolean} true si es admin, false si fue redirigido
   */
  const requireAdmin = (redirectFn?: (path: string) => void): boolean => {
    if (!isAdmin.value) {
      if (redirectFn) {
        redirectFn('/')
      }
      return false
    }
    return true
  }

  return {
    isAdmin,
    hasAdminPermissions,
    checkIfUserIsAdmin,
    requireAdmin
  }
}
