<template>
<section class="h-screen space-y-8  rounded-lg shadow-lg p-8 flex justify-center items-center ">

  <div class="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8 ">
    <div>
      <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
        Crear Cuenta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Regístrate con tu correo y contraseña para comenzar
      </p>
    </div>
    <form class="mt-8 space-y-6" @submit.prevent="handleSignUp" novalidate method="post">
      <div class="">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            v-model="form.email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-500': errors.email }"
            aria-invalid="true"
            aria-describedby="email-error"
          />
          <p v-if="errors.email" id="email-error" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>
        
        <div class="mb-4">
          <label for="nick_name" class="block text-sm font-medium text-gray-700">
            Nombre de usuario
          </label>
          <input
            id="nick_name"
            name="nick_name"
            type="text"
            autocomplete="username"
            v-model="form.nick_name"
            required
            placeholder="Ej: juan123"
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-500': errors.nick_name }"
            aria-invalid="true"
            aria-describedby="nick_name-error"
          />
          <p v-if="errors.nick_name" id="nick_name-error" class="mt-1 text-sm text-red-600">{{ errors.nick_name }}</p>
        </div>

        <div class="mb-4">
          <label for="complete_name" class="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            id="complete_name"
            name="complete_name"
            type="text"
            autocomplete="name"
            v-model="form.complete_name"
            required
            placeholder="Ej: Juan Pérez"
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-500': errors.complete_name }"
            aria-invalid="true"
            aria-describedby="complete_name-error"
          />
          <p v-if="errors.complete_name" id="complete_name-error" class="mt-1 text-sm text-red-600">{{ errors.complete_name }}</p>
        </div>
        
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="new-password"
            v-model="form.password"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-500': errors.password }"
            aria-invalid="true"
            aria-describedby="password-error"
          />
          <p v-if="errors.password" id="password-error" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            v-model="form.confirmPassword"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-500': errors.confirmPassword }"
            aria-invalid="true"
            aria-describedby="confirm-password-error"
          />
          <p v-if="errors.confirmPassword" id="confirm-password-error" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
        </div>
      </div>

      <div v-if="errors.submit" class="text-red-600 text-sm mt-2 text-center">
        {{ errors.submit }}
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          :disabled="isSubmitting"
          :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
        >
          {{ isSubmitting ? 'Registrando...' : 'Crear Cuenta' }}
        </button>
      </div>
    </form>
    <div class="mt-4 text-center">
      <router-link to="/login" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
        ¿Ya tienes cuenta? Inicia sesión
      </router-link>
    </div>
  </div>
</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AuthService } from '@/services/authService'

export default defineComponent({
  name: 'AppSignUp',
  data() {
    return {
      form: {
        email: '',
        nick_name: '',
        complete_name: '',
        password: '',
        confirmPassword: ''
      },
      errors: {} as Record<string, string>,
      isSubmitting: false
    }
  },
  methods: {
    /**
     * Valida el formulario de registro
     * @returns {boolean}
     */
    validateForm(): boolean {
      this.errors = AuthService.validateSignUpCredentials({
        email: this.form.email,
        nick_name: this.form.nick_name,
        complete_name: this.form.complete_name,
        password: this.form.password,
        confirmPassword: this.form.confirmPassword
      })

      return Object.keys(this.errors).length === 0
    },

    /**
     * Maneja el envío del formulario de registro
     */
    async handleSignUp() {
      if (!this.validateForm()) return
      if (await AuthService.checkNicknameExists(this.form.nick_name)) {
        this.errors.nick_name = 'El nombre de usuario ya está en uso'
        return
      }
      this.isSubmitting = true
      this.errors.submit = ''

      try {
        const response = await AuthService.signUp({
          email: this.form.email,
          nick_name: this.form.nick_name,
          complete_name: this.form.complete_name,
          password: this.form.password,
          confirmPassword: this.form.confirmPassword
        })

        if (!response.success) {
          this.errors.submit = response.error || 'Error al registrar usuario'
          return
        }

        // Redirigir o mostrar mensaje de confirmación
        // Por ejemplo, redirigir a login o mostrar mensaje de verificación
        this.$router.push({ path: '/login', query: { registered: 'true' } })
      } catch (err: any) {
        this.errors.submit = err.message || 'Ocurrió un error inesperado'
      } finally {
        this.isSubmitting = false
      }
    }
  }
})
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si es necesario */
</style>