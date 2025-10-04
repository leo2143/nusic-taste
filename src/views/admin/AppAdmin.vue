<template>
  <section class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p class="text-gray-600">Gestiona usuarios de la plataforma</p>
        </div>
        <button
          @click="createNewUser"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          ➕ Nuevo Usuario
        </button>
      </div>

      <!-- Estados de carga y error -->
      <AppStateDisplay
        :state="currentState"
        :loading-text="'Cargando usuarios...'"
        :error-title="'Error al cargar usuarios'"
        :error-message="error"
        :empty-icon="'👥'"
        :empty-title="'No hay usuarios'"
        :empty-message="'No se encontraron usuarios en la plataforma'"
        :retry-text="'Reintentar'"
        @retry="fetchUsers"
      >
        <!-- Tabla de usuarios -->
        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img 
                          :src="user.profile_image || '/default-avatar.svg'" 
                          :alt="`Avatar de ${user.complete_name}`"
                          class="h-10 w-10 rounded-full object-cover"
                          @error="handleImageError"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.complete_name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          @{{ user.nick_name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.age || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(user.created_at) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="editUser(user)"
                        class="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar usuario"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        @click="confirmDeleteUser(user)"
                        class="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar usuario"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AppStateDisplay>
    </div>

    <!-- Modal de edición -->
    <AppModal
      :is-visible="showEditModal"
      :title="isCreatingUser ? 'Crear Usuario' : 'Editar Usuario'"
      :size="'md'"
      :show-header="true"
      :show-close-button="true"
      :show-footer="false"
      @close="closeEditModal"
    >
      <form method="post" @submit.prevent="saveUser" class="space-y-4">
        <div>
          <label for="edit-complete_name" class="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo
          </label>
          <input
            id="edit-complete_name"
            v-model="editForm.complete_name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="edit-nick_name" class="block text-sm font-medium text-gray-700 mb-1">
            Nickname
          </label>
          <input
            id="edit-nick_name"
            v-model="editForm.nick_name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="edit-email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="edit-email"
            v-model="editForm.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="edit-age" class="block text-sm font-medium text-gray-700 mb-1">
            Edad
          </label>
          <input
            id="edit-age"
            v-model.number="editForm.age"
            type="number"
            min="0"
            max="120"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="edit-gender" class="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            id="edit-gender"
            v-model="editForm.gender"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>
        
        <div>
          <label for="edit-profile_image" class="block text-sm font-medium text-gray-700 mb-1">
            Imagen de Perfil (URL)
          </label>
          <input
            id="edit-profile_image"
            v-model="editForm.profile_image"
            type="url"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Campo de contraseña solo para crear usuario -->
        <div v-if="isCreatingUser">
          <label for="edit-password" class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="edit-password"
            v-model="editForm.password"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <!-- Campo para marcar como admin (solo para crear/editar) -->
        <div v-if="isCreatingUser || (editingUser && editingUser.id !== currentUserId)">
          <label class="flex items-center">
            <input
              v-model="editForm.is_admin"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Usuario Administrador</span>
          </label>
        </div>

        <!-- Botones del formulario -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="closeEditModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
          >
            {{ isSaving ? 'Guardando...' : (isCreatingUser ? 'Crear Usuario' : 'Guardar Cambios') }}
          </button>
        </div>
      </form>
    </AppModal>

    <!-- Modal de confirmación de eliminación -->
    <AppModal
      :is-visible="showDeleteModal"
      :title="'Confirmar Eliminación'"
      :size="'sm'"
      :show-header="true"
      :show-close-button="true"
      :show-footer="false"
      @close="closeDeleteModal"
    >
      <form method="post" @submit.prevent="deleteUser">
        <div v-if="userToDelete">
          <p class="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar al usuario 
            <strong>{{ userToDelete.complete_name }}</strong> (@{{ userToDelete.nick_name }})?
          </p>
          <p class="text-sm text-red-600 mb-4">
            ⚠️ Esta acción no se puede deshacer y eliminará todos los posts y comentarios del usuario.
          </p>
        </div>

        <!-- Botones del formulario -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="closeDeleteModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isDeleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-md transition-colors"
          >
            {{ isDeleting ? 'Eliminando...' : 'Eliminar Usuario' }}
          </button>
        </div>
      </form>
    </AppModal>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserService } from '@/services/userService'
import { AuthService } from '@/services/authService'
import AppStateDisplay from '@/components/AppStateDisplay.vue'
import AppModal from '@/components/AppModal.vue'
import { store } from '@/lib/store.js'
import type { User, UpdateUser } from '@/models'

export default defineComponent({
  name: 'AppAdmin',
  components: {
    AppStateDisplay,
    AppModal
  },
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      showEditModal: false,
      showDeleteModal: false,
      editingUser: null,
      userToDelete: null,
      isCreatingUser: false,
      editForm: {
        complete_name: '',
        nick_name: '',
        email: '',
        age: 0,
        gender: '',
        profile_image: '',
        password: '',
        is_admin: false
      },
      isSaving: false,
      isDeleting: false
    }
  },
  computed: {
    currentState() {
      if (this.loading) return 'loading'
      if (this.error) return 'error'
      if (!this.users || this.users.length === 0) return 'empty'
      return 'success'
    },
    currentUserId() {
      // Obtener el ID del usuario actual desde el store
      return store.state.user?.id || null
    }
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await UserService.getAllUsers()
        
        if (response.error) {
          this.error = response.error
          this.users = []
        } else {
          this.users = response.data || []
        }
      } catch (err) {
        this.error = err.message || 'Error al cargar usuarios'
        this.users = []
      } finally {
        this.loading = false
      }
    },

    createNewUser() {
      this.isCreatingUser = true
      this.editingUser = null
      this.editForm = {
        complete_name: '',
        nick_name: '',
        email: '',
        age: 0,
        gender: '',
        profile_image: '',
        password: '',
        is_admin: false
      }
      this.showEditModal = true
    },

    editUser(user) {
      this.isCreatingUser = false
      this.editingUser = user
      this.editForm = {
        complete_name: user.complete_name || '',
        nick_name: user.nick_name || '',
        email: user.email || '',
        age: user.age || 0,
        gender: user.gender || '',
        profile_image: user.profile_image || '',
        password: '', // No mostrar contraseña al editar
        is_admin: user.is_admin || false
      }
      this.showEditModal = true
    },

    closeEditModal() {
      this.showEditModal = false
      this.editingUser = null
      this.isCreatingUser = false
      this.editForm = {
        complete_name: '',
        nick_name: '',
        email: '',
        age: 0,
        gender: '',
        profile_image: '',
        password: '',
        is_admin: false
      }
    },

    async saveUser() {
      this.isSaving = true
      
      try {
        if (this.isCreatingUser) {
          // Crear nuevo usuario usando AuthService.createUserFromAdmin (sin login automático)
          const signUpData = {
            email: this.editForm.email,
            nick_name: this.editForm.nick_name,
            complete_name: this.editForm.complete_name,
            password: this.editForm.password,
            confirmPassword: this.editForm.password
          }
          
          const response = await AuthService.createUserFromAdmin(signUpData)
          
          if (!response.success) {
            alert('Error al crear usuario: ' + response.error)
            return
          }
          
          // Si el usuario se creó exitosamente, actualizar con datos adicionales
          if (response.user) {
            const updateData = {
              age: this.editForm.age,
              gender: this.editForm.gender,
              profile_image: this.editForm.profile_image,
              is_admin: this.editForm.is_admin
            }
            
            // Actualizar el usuario con los datos adicionales
            const updateResponse = await UserService.updateUser(response.user.id, updateData)
            
            if (updateResponse.error) {
              console.warn('Usuario creado pero error al actualizar datos adicionales:', updateResponse.error)
            }
            
            // Recargar la lista de usuarios para mostrar el nuevo usuario
            await this.fetchUsers()
            this.closeEditModal()
            alert('Usuario creado exitosamente')
          }
        } else {
          // Actualizar usuario existente
          if (!this.editingUser) return
          
          const updateData = {
            complete_name: this.editForm.complete_name,
            nick_name: this.editForm.nick_name,
            email: this.editForm.email,
            age: this.editForm.age,
            gender: this.editForm.gender,
            profile_image: this.editForm.profile_image,
            is_admin: this.editForm.is_admin
          }
          
          const response = await UserService.updateUser(this.editingUser.id, updateData)
          
          if (response.error) {
            alert('Error al actualizar usuario: ' + response.error)
          } else {
            // Actualizar el usuario en la lista
            const index = this.users.findIndex(u => u.id === this.editingUser.id)
            if (index !== -1) {
              this.users[index] = { ...this.users[index], ...updateData }
            }
            this.closeEditModal()
            alert('Usuario actualizado exitosamente')
          }
        }
      } catch (err) {
        alert('Error al procesar usuario: ' + err.message)
      } finally {
        this.isSaving = false
      }
    },

    confirmDeleteUser(user) {
      this.userToDelete = user
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.userToDelete = null
    },

    async deleteUser() {
      if (!this.userToDelete) return
      
      this.isDeleting = true
      
      try {
        // Usar AuthService.deleteUserFromAdmin para eliminar de Auth y tabla users
        const response = await AuthService.deleteUserFromAdmin(this.userToDelete.id)
        
        if (!response.success) {
          alert('Error al eliminar usuario: ' + response.error)
        } else {
          // Remover el usuario de la lista
          this.users = this.users.filter(u => u.id !== this.userToDelete.id)
          this.closeDeleteModal()
          alert('Usuario eliminado exitosamente')
        }
      } catch (err) {
        alert('Error al eliminar usuario: ' + err.message)
      } finally {
        this.isDeleting = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    handleImageError(event) {
      event.target.src = '/default-avatar.svg'
    }
  }
})
</script>

<style scoped>
/* Estilos específicos si es necesario */
</style>
