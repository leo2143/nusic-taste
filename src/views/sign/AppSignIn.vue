
<template>
  <section class="h-screen space-y-8  rounded-lg shadow-lg p-8 flex justify-center items-center">
          <div class="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8">
        <div>
          <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa con tu correo y contraseña para continuar
          </p>
        </div>
        <form method="post" class="mt-8 space-y-6" @submit.prevent="handleLogin" novalidate>
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
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                v-model="form.password"
                required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                :class="{ 'border-red-500': errors.password }"
                aria-invalid="true"
                aria-describedby="password-error"
              />
              <p v-if="errors.password" id="password-error" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
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
              {{ isSubmitting ? 'Ingresando...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>
        <div class="mt-4 text-center">
          <router-link to="/register" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ¿No tienes cuenta? Regístrate
          </router-link>
        </div>
      </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AuthService } from '@/services/authService'
export default defineComponent({
  name: 'AppSignIn',
  components: {

  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {} as Record<string, string>,
      isSubmitting: false
    }
  },
  methods: {
    /**
     * Valida el formulario de inicio de sesión
     * @returns {boolean}
     */
    validateForm(): boolean {
      this.errors = AuthService.validateLoginCredentials({
        email: this.form.email,
        password: this.form.password
      })

      return Object.keys(this.errors).length === 0
    },

    /**
     * Maneja el envío del formulario de inicio de sesión
     */
    async handleLogin() {
      if (!this.validateForm()) return

      this.isSubmitting = true
      this.errors.submit = ''

      try {
        const response = await AuthService.signIn({
          email: this.form.email,
          password: this.form.password
        })

        if (!response.success) {
          this.errors.submit = response.error || 'Error al iniciar sesión'
          return
        }
        console.log("paso el response y logeo")
        // Redirigir al usuario a la página principal o dashboard
        this.$router.push({ path: '/' })
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