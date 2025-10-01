<template>
  <header class="bg-white shadow-md">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex-shrink-0">
          <router-link 
            to="/" 
            class="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            Music Taste
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/' }"
            >
              Inicio
            </router-link>
            <router-link
              to="/chat"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/chat' }"
            >
              Chat
            </router-link>
            <router-link
              to="/iniciar-sesion"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/iniciar-sesion' }"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/registro"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/registro' }"
            >
              Registro
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded="false"
          >
            <span class="sr-only">Abrir menú principal</span>
            <!-- Hamburger icon -->
            <svg
              v-if="!isMobileMenuOpen"
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Close icon -->
            <svg
              v-else
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          <router-link
            to="/"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/' }"
            @click="closeMobileMenu"
          >
            Inicio
          </router-link>
          <router-link
            to="/chat"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/chat' }"
            @click="closeMobileMenu"
          >
            Chat
          </router-link>
          <router-link
            to="/iniciar-sesion"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/iniciar-sesion' }"
            @click="closeMobileMenu"
          >
            Iniciar Sesión
          </router-link>
          <router-link
            to="/registro"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/registro' }"
            @click="closeMobileMenu"
          >
            Registro
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHeader',
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    }
  },
  watch: {
    '$route'() {
      // Cerrar menú móvil cuando cambie la ruta
      this.closeMobileMenu()
    }
  }
})
</script>

<style scoped>

</style>
