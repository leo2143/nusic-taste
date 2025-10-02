<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center mb-4">
            <h3 class="text-2xl font-bold text-white">Music Taste</h3>
          </div>
          <p class="text-gray-300 mb-4 text-sm leading-relaxed">
            Descubre tu verdadero gusto musical con nuestra plataforma inteligente. 
            Analizamos tus preferencias y te conectamos con la música que realmente amas.
          </p>
          <div class="flex space-x-4">
            <a 
              href="#" 
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281H7.721c-.807 0-1.297.49-1.297 1.297v7.83c0 .807.49 1.297 1.297 1.297h8.558c.807 0 1.297-.49 1.297-1.297v-7.83c0-.807-.49-1.297-1.297-1.297z"/>
              </svg>
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
          <ul class="space-y-2">
            <li>
              <router-link 
                to="/" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Inicio
              </router-link>
            </li>
            <li>
              <router-link 
                to="/chat" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Chat Musical
              </router-link>
            </li>
            <li>
              <router-link 
                to="/iniciar-sesion" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Iniciar Sesión
              </router-link>
            </li>
            <li>
              <router-link 
                to="/registro" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Registro
              </router-link>
            </li>
            <li>
              <a 
                href="#" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Explorar Géneros
              </a>
            </li>
          </ul>
        </div>

        <!-- Features -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Características</h4>
          <ul class="space-y-2">
            <li>
              <a 
                href="#" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Análisis de Gustos
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Recomendaciones IA
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Playlists Personalizadas
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Descubrir Artistas
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Estadísticas Musicales
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Contacto</h4>
          <div class="space-y-3">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <div>
                <p class="text-gray-300 text-sm">contacto@musictaste.com</p>
                <p class="text-gray-300 text-sm">soporte@musictaste.com</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <p class="text-gray-300 text-sm">Buenos Aires, Argentina</p>
            </div>
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <p class="text-gray-300 text-sm">+54 11 1234-5678</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Subscription -->
      <div class="mt-12 pt-8 border-t border-gray-800">
        <div class="max-w-md mx-auto text-center">
          <h4 class="text-lg font-semibold mb-2">Mantente al día</h4>
          <p class="text-gray-300 text-sm mb-4">
            Recibe las últimas recomendaciones musicales y actualizaciones
          </p>
          <form @submit.prevent="handleNewsletterSubmit" class="flex flex-col sm:flex-row gap-2">
            <input
              v-model="newsletterEmail"
              type="email"
              placeholder="Tu email"
              required
              class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              :disabled="isNewsletterSubmitting"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {{ isNewsletterSubmitting ? 'Enviando...' : 'Suscribirse' }}
            </button>
          </form>
          <p v-if="newsletterMessage" class="mt-2 text-sm" :class="newsletterMessageType === 'success' ? 'text-green-400' : 'text-red-400'">
            {{ newsletterMessage }}
          </p>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="mt-12 pt-8 border-t border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-400 text-sm mb-4 md:mb-0">
            <p>&copy; {{ currentYear }} Music Taste. Todos los derechos reservados.</p>
          </div>
          <div class="flex space-x-6">
            <a 
              href="#" 
              class="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Política de Privacidad
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Términos de Servicio
            </a>
            <a 
              href="#" 
              class="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFooter',
  data() {
    return {
      newsletterEmail: '',
      isNewsletterSubmitting: false,
      newsletterMessage: '',
      newsletterMessageType: 'success' as 'success' | 'error',
      currentYear: new Date().getFullYear()
    }
  },
  methods: {
    async handleNewsletterSubmit() {
      if (!this.newsletterEmail.trim()) return
      
      this.isNewsletterSubmitting = true
      this.newsletterMessage = ''
      
      try {
        // Simular envío de newsletter (aquí iría la integración con Supabase)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.newsletterMessage = '¡Gracias por suscribirte! Te mantendremos informado.'
        this.newsletterMessageType = 'success'
        this.newsletterEmail = ''
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.newsletterMessage = ''
        }, 5000)
        
      } catch (error) {
        this.newsletterMessage = 'Error al suscribirse. Inténtalo de nuevo.'
        this.newsletterMessageType = 'error'
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.newsletterMessage = ''
        }, 5000)
      } finally {
        this.isNewsletterSubmitting = false
      }
    }
  }
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
