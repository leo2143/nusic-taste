<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y navegación principal -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">M</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Music Taste</h1>
          </router-link>
          
          <!-- Navegación desktop -->
          <div class="hidden md:flex items-center space-x-6">
            <router-link 
              to="/" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
            >
              Inicio
            </router-link>
            <router-link 
              to="/explore" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/explore' }"
            >
              Explorar
            </router-link>
            <router-link 
              to="/trending" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/trending' }"
            >
              Trending
            </router-link>
          </div>
        </div>

        <!-- Usuario y acciones -->
        <div class="flex items-center space-x-4">
          <!-- Usuario autenticado -->
          <template v-if="isLoggedIn && currentUser">
            <div class="hidden md:flex items-center space-x-4">
              <router-link
                :to="`/user/${currentUser.nick_name}`"
                class="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-2 transition-colors"
                :title="`Ver perfil de ${currentUser.complete_name}`"
              >
                <img
                  :src="userProfileImage"
                  :alt="`Avatar de ${currentUser.comick_name}`"
                  class="w-8 h-8 rounded-full object-cover"
                  @error="handleImageError"
                />
                <span class="text-sm font-medium text-gray-700 hidden lg:block">
                  {{ currentUser.complete_name }}
                </span>
              </router-link>
              
              <div class="relative">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <!-- Menú desplegable del usuario -->
                <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                >
                  <router-link
                    :to="`/user/detail/${currentUser.nick_name}`"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="closeUserMenu"
                  >
                    Editar Perfil
                  </router-link>
                  
                  <!-- Enlace de administración solo para admin -->
                  <router-link
                    v-if="isAdmin"
                    to="/admin"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="closeUserMenu"
                  >
                    ⚙️ Administración
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>

            <!-- Botón de menú móvil para usuario autenticado -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </template>

          <!-- Usuario no autenticado -->
          <template v-else>
            <div class="hidden md:flex items-center space-x-4">
              <router-link
                to="/login"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Iniciar Sesión
              </router-link>
              <router-link
                to="/register"
                class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Registrarse
              </router-link>
            </div>

            <!-- Botón de menú móvil para usuario no autenticado -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </template>
        </div>
      </div>

      <!-- Menú móvil -->
      <div v-if="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <router-link
            to="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
            @click="closeMobileMenu"
          >
            Inicio
          </router-link>
          <router-link
            to="/explore"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/explore' }"
            @click="closeMobileMenu"
          >
            Explorar
          </router-link>
          <router-link
            to="/trending"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/trending' }"
            @click="closeMobileMenu"
          >
            Trending
          </router-link>
          
          <!-- Enlaces móviles para usuario autenticado -->
          <template v-if="isLoggedIn && currentUser">
            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex items-center px-3 py-2">
                <img
                  :src="userProfileImage"
                  :alt="`Avatar de ${currentUser.nick_name}`"
                  class="w-10 h-10 rounded-full object-cover mr-3"
                  @error="handleImageError"
                />
                <div>
                  <p class="text-base font-medium text-gray-900">{{ currentUser.complete_name }}</p>
                  <p class="text-sm text-gray-500">@{{ currentUser.nick_name }}</p>
                </div>
              </div>
              <router-link
                :to="`/user/${currentUser.nick_name}`"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                @click="closeMobileMenu"
              >
                Mi Perfil
              </router-link>
              <router-link
                :to="`/user/detail/${currentUser.nick_name}`"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                @click="closeMobileMenu"
              >
                Editar Perfil
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </template>
          
          <!-- Enlaces móviles para usuario no autenticado -->
          <template v-else>
            <div class="border-t border-gray-200 pt-4 mt-4">
              <router-link
                to="/login"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                @click="closeMobileMenu"
              >
                Iniciar Sesión
              </router-link>
              <router-link
                to="/register"
                class="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                @click="closeMobileMenu"
              >
                Registrarse
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AuthService } from '@/services/authService.js'
import { store } from '@/lib/store.js'
import { useAdmin } from '@/composables/useAdmin.js'
import type { User } from '@/models'

export default defineComponent({
  name: 'AppHeader',
  data() {
    return {
      isMobileMenuOpen: false,
      isUserMenuOpen: false
    }
  },
  computed: {
    // ✅ Usar computed properties para reactividad
    isLoggedIn() {
      return store.state.isAuthenticated
    },
    currentUser() {
      return store.state.user
    },
    userProfileImage() {
      return this.currentUser?.profile_image || '/default-avatar.svg'
    },
    isAdmin() {
      const { isAdmin } = useAdmin()
      return isAdmin.value
    }
  },
  watch: {
    'store.state.isAuthenticated'() {
      this.$forceUpdate()
    },
    'store.state.user'() {
      this.$forceUpdate()
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    closeUserMenu() {
      this.isUserMenuOpen = false
    },
    async handleLogout() {
      try {
        const response = await AuthService.signOut()
        
        if (!response.success) {
          console.error('Error signing out:', response.error)
          return
        }
        
        store.clearUser()
        
        this.$forceUpdate()
        
        this.closeMobileMenu()
        this.closeUserMenu()
        
        // Redirigir al login
        this.$router.push('/login')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    },
    handleImageError(event: Event) {
      const img = event.target as HTMLImageElement
      img.src = '/default-avatar.svg'
    }
  },
  async mounted() {
    await store.initializeAuth()
    
    AuthService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await store.initializeAuth()
        this.$forceUpdate()
      } else if (event === 'SIGNED_OUT') {
        store.clearUser()
        this.$forceUpdate()
      }
    })
  }
})
</script>

<style scoped>
/* Estilos existentes se mantienen */
</style>