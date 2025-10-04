<template>
  <section class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        Editar Perfil
      </h2>
      
      <!-- Estados de carga y error -->
      <AppStateDisplay
        :state="currentState"
        :loading-text="'Cargando datos del usuario...'"
        :error-title="'Error al cargar el perfil'"
        :error-message="error"
        :show-retry="false"
      >
        <!-- Formulario de edición -->
        <form method="post" v-if="userDetail" @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre Completo -->
          <div>
            <label for="complete_name" class="block text-sm font-medium text-gray-600 mb-2">
              Nombre Completo
            </label>
            <input
              id="complete_name"
              v-model="formData.complete_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': formErrors.complete_name }"
            />
            <p v-if="formErrors.complete_name" class="mt-1 text-sm text-red-600">
              {{ formErrors.complete_name }}
            </p>
          </div>
          
          <!-- Nickname -->
          <div>
            <label for="nick_name" class="block text-sm font-medium text-gray-600 mb-2">
              Nickname
            </label>
            <input
              id="nick_name"
              v-model="formData.nick_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': formErrors.nick_name }"
            />
            <p v-if="formErrors.nick_name" class="mt-1 text-sm text-red-600">
              {{ formErrors.nick_name }}
            </p>
          </div>
          
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': formErrors.email }"
            />
            <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">
              {{ formErrors.email }}
            </p>
          </div>
          
          <!-- Edad -->
          <div>
            <label for="age" class="block text-sm font-medium text-gray-600 mb-2">
              Edad
            </label>
            <input
              id="age"
              v-model.number="formData.age"
              type="number"
              min="0"
              max="120"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': formErrors.age }"
            />
            <p v-if="formErrors.age" class="mt-1 text-sm text-red-600">
              {{ formErrors.age }}
            </p>
          </div>
          
          <!-- Género -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-600 mb-2">
              Género
            </label>
            <select
              id="gender"
              v-model="formData.gender"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': formErrors.gender }"
            >
              <option value="">Seleccionar género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
            <p v-if="formErrors.gender" class="mt-1 text-sm text-red-600">
              {{ formErrors.gender }}
            </p>
          </div>
          
          <!-- Imagen de Perfil -->
          <div class="md:col-span-2">
            <label for="profile_image" class="block text-sm font-medium text-gray-600 mb-2">
              URL de Imagen de Perfil
            </label>
            
            <!-- Vista previa de la imagen actual -->
            <div v-if="currentImageUrl && currentImageUrl !== '/default-avatar.svg'" class="mb-4">
              <p class="text-sm text-gray-600 mb-2">Imagen actual:</p>
              <div class="relative inline-block">
                <img
                  :src="currentImageUrl"
                  alt="Imagen de perfil actual"
                  class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  @error="handleImageError"
                />
              </div>
            </div>
            
            <!-- Input para URL de imagen -->
            <input
              id="profile_image"
              v-model="formData.profile_image"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': formErrors.profile_image }"
            />
            
            <!-- Vista previa de la nueva imagen -->
            <div v-if="formData.profile_image && isValidImageUrl(formData.profile_image)" class="mt-4">
              <p class="text-sm text-gray-600 mb-2">Vista previa:</p>
              <div class="relative inline-block">
                <img
                  :src="formData.profile_image"
                  alt="Vista previa de la nueva imagen"
                  class="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                  @error="handleImagePreviewError"
                />
              </div>
            </div>
            
            <p v-if="formErrors.profile_image" class="mt-1 text-sm text-red-600">
              {{ formErrors.profile_image }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              Ingresa la URL completa de una imagen (JPG, PNG, GIF)
            </p>
          </div>
      
        </div>
        
        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <router-link
            type="button"
            :to="`/user/${userDetail?.nick_name}`"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
      
        <div v-else class="text-gray-500">No se encontraron datos del usuario.</div>
      </AppStateDisplay>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { UserService } from '@/services/userService'
import AppStateDisplay from '@/components/AppStateDisplay.vue'
import type { User, UpdateUser } from '@/models'

export default defineComponent({
  name: 'AppUserDetail',
  components: {
    AppStateDisplay
  },
  props: {
    nick_name: {
      type: [String, Number] as PropType<string | number>,
      required: true
    }
  },
  data() {
    return {
      userDetail: null as User | null,
      isLoading: false,
      error: null as string | null,
      isSubmitting: false,
      formData: {
        complete_name: '',
        nick_name: '',
        email: '',
        age: 0,
        gender: '',
        profile_image: ''
      },
      originalData: {
        complete_name: '',
        nick_name: '',
        email: '',
        age: 0,
        gender: '',
        profile_image: ''
      },
      formErrors: {} as Record<string, string>,
      currentImageUrl: '' as string,
      // Constantes para validaciones
      EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },

  computed: {
    currentState() {
      if (this.isLoading) return 'loading'
      if (this.error) return 'error'
      return 'success'
    }
  },

  emits: [],
  methods: {
    /**
     * Obtiene el detalle del usuario desde Supabase
     */
    async fetchUserDetail() {
      this.isLoading = true
      this.error = null
      try {
        const response = await UserService.getUserByNickName(this.nick_name.toString())
        
        if (!response.data) {
          this.error = response.error || 'Usuario no encontrado'
          this.userDetail = null
        } else {
          this.userDetail = response.data
          this.initializeFormData()
        }
      } catch (err: any) {
        this.error = err.message || 'Error al cargar los datos del usuario'
        this.userDetail = null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Inicializa los datos del formulario con los datos del usuario
     */
    initializeFormData() {
      if (this.userDetail) {
        this.formData = {
          complete_name: this.userDetail.complete_name || '',
          nick_name: this.userDetail.nick_name || '',
          email: this.userDetail.email || '',
          age: this.userDetail.age || 0,
          gender: this.userDetail.gender || '',
          profile_image: this.userDetail.profile_image || ''
        }
        
        // Guardar datos originales para comparación
        this.originalData = { ...this.formData }
        
        // Establecer URL de la imagen actual
        this.currentImageUrl = this.userDetail.profile_image || '/default-avatar.svg'
      }
    },

    /**
     * Valida los datos del formulario
     */
    validateForm(): boolean {
      this.formErrors = {}

      // Validar nombre completo
      if (!this.formData.complete_name.trim()) {
        this.formErrors.complete_name = 'El nombre completo es requerido'
      } else if (this.formData.complete_name.trim().length < 2) {
        this.formErrors.complete_name = 'El nombre debe tener al menos 2 caracteres'
      }

      // Validar nickname
      if (!this.formData.nick_name.trim()) {
        this.formErrors.nick_name = 'El nickname es requerido'
      } else if (this.formData.nick_name.trim().length < 3) {
        this.formErrors.nick_name = 'El nickname debe tener al menos 3 caracteres'
      }

      // Validar email
      if (!this.formData.email.trim()) {
        this.formErrors.email = 'El email es requerido'
      } else if (!this.isValidEmail(this.formData.email)) {
        this.formErrors.email = 'Ingrese un email válido'
      }

      // Validar edad
      if (this.formData.age < 0 || this.formData.age > 120) {
        this.formErrors.age = 'La edad debe estar entre 0 y 120 años'
      }

      // Validar URL de imagen de perfil (si se proporcionó)
      if (this.formData.profile_image && this.formData.profile_image.trim()) {
        if (!this.isValidImageUrl(this.formData.profile_image.trim())) {
          this.formErrors.profile_image = 'Ingresa una URL válida de imagen (JPG, PNG, GIF)'
        }
      }

      return Object.keys(this.formErrors).length === 0
    },

    /**
     * Valida si un email es válido
     */
    isValidEmail(email: string): boolean {
      return this.EMAIL_REGEX.test(email)
    },

    /**
     * Valida si una URL de imagen es válida
     */
    isValidImageUrl(url: string): boolean {
      try {
        const urlObj = new URL(url)
        const validProtocols = ['http:', 'https:']
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
        // Verificar protocolo
        if (!validProtocols.includes(urlObj.protocol)) {
          return false
        }
        
        // Verificar extensión
        const hasValidExtension = validExtensions.some(ext => 
          urlObj.pathname.toLowerCase().endsWith(ext)
        )
        
        return hasValidExtension
      } catch {
        return false
      }
    },

    /**
     * Verifica si el nickname ya existe (si cambió)
     */
    async checkNicknameExists(): Promise<boolean> {
      if (this.formData.nick_name === this.originalData.nick_name) {
        return false // No cambió, no hay conflicto
      }

      try {
        const result = await UserService.checkNicknameExists(this.formData.nick_name)
        return result.exists
      } catch (error) {
        console.error('Error checking nickname:', error)
        return false
      }
    },

    /**
     * Verifica si el email ya existe (si cambió)
     */
    async checkEmailExists(): Promise<boolean> {
      if (this.formData.email === this.originalData.email) {
        return false // No cambió, no hay conflicto
      }

      try {
        const response = await UserService.getUserByEmail(this.formData.email)
        return response.data !== null
      } catch (error) {
        console.error('Error checking email:', error)
        return false
      }
    },

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      // Verificar si hay cambios
      const hasChanges = Object.keys(this.formData).some(
        key => this.formData[key as keyof typeof this.formData] !== this.originalData[key as keyof typeof this.originalData]
      )

      if (!hasChanges) {
        this.error = 'No hay cambios para guardar'
        return
      }

      this.isSubmitting = true
      this.error = null

      try {
        // Verificar unicidad de nickname y email
        const nicknameExists = await this.checkNicknameExists()
        const emailExists = await this.checkEmailExists()

        if (nicknameExists) {
          this.formErrors.nick_name = 'Este nickname ya está en uso'
          this.isSubmitting = false
          return
        }

        if (emailExists) {
          this.formErrors.email = 'Este email ya está en uso'
          this.isSubmitting = false
          return
        }

        // Preparar datos para actualización
        const updateData: UpdateUser = {
          id: this.userDetail!.id.toString(),
          complete_name: this.formData.complete_name.trim(),
          nick_name: this.formData.nick_name.trim(),
          email: this.formData.email.trim(),
          age: this.formData.age,
          gender: this.formData.gender,
          profile_image: this.formData.profile_image.trim() || ''
        }

        // Actualizar usuario
        const response = await UserService.updateUser(this.userDetail!.id, updateData)

        if (response.error) {
          this.error = response.error
        } else {
          // Actualizar datos locales
          this.userDetail = response.data
          this.originalData = { ...this.formData }
          
          // Mostrar mensaje de éxito
          this.error = null
          alert('Perfil actualizado exitosamente')
          
          // Redirigir al perfil del usuario
          this.$router.push(`/user/${this.formData.nick_name}`)
        }
      } catch (err: any) {
        this.error = err.message || 'Error al actualizar el perfil'
      } finally {
        this.isSubmitting = false
      }
    },

    /**
     * Maneja errores de carga de imagen actual
     */
    handleImageError(event: Event) {
      const img = event.target as HTMLImageElement
      img.src = '/default-avatar.svg'
    },

    /**
     * Maneja errores de carga de imagen en vista previa
     */
    handleImagePreviewError(event: Event) {
      const img = event.target as HTMLImageElement
      img.style.display = 'none'
    },

    /**
     * Resetea el formulario a los datos originales
     */
    resetForm() {
      this.formData = { ...this.originalData }
      this.formErrors = {}
      this.error = null
    }
  },

  async mounted() {
    console.log(this.nick_name)
    await this.fetchUserDetail()
  },

  watch: {
    nick_name: {
      immediate: false,
      handler() {
        this.fetchUserDetail()
      }
    }
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f9fafb;
}
</style>