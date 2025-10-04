<template>
  <AppModal
    :is-visible="isVisible"
    :title="isEditMode ? 'Editar Post' : 'Crear Nuevo Post'"
    size="lg"
    :show-header="true"
    :show-footer="false"
    :show-close-button="true"
    :close-on-overlay="true"
    @close="handleClose"
  >
    <form method="post" @submit.prevent="handleSubmit" class="space-y-6">
      <input type="text" v-model="formData.id" hidden>
      <input type="number" v-model="formData.likes" hidden>
      
      <div class="flex flex-col gap-5">
        <div class="flex flex-col">
          <label for="description" class="font-semibold text-gray-800 mb-2 text-sm">Descripción *</label>
          <textarea 
            id="description" 
            v-model="formData.description"
            placeholder="¿Qué estás pensando?"
            rows="4"
            class="p-3 border-2 border-gray-100 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-600 resize-vertical min-h-[100px]"
            :class="{ 'border-red-500': formErrors.description }"
            required
          ></textarea>
          <p v-if="formErrors.description" class="text-red-500 text-xs mt-1 mb-0">{{ formErrors.description }}</p>
        </div>

        <div class="flex flex-col">
          <label for="img_path" class="font-semibold text-gray-800 mb-2 text-sm">Url de la Imagen {{ isEditMode ? '(opcional)' : '*' }}</label>
          <input 
            type="text" 
            id="img_path" 
            accept="image/*"
            v-model="formData.img_path"
            class="p-3 border-2 border-gray-100 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-600"
            :class="{ 'border-red-500': formErrors.img_path }"
            :required="!isEditMode"
          >
          <p v-if="formErrors.img_path" class="text-red-500 text-xs mt-1 mb-0">{{ formErrors.img_path }}</p>
        </div>

        <p v-if="formErrors.user" class="text-red-500 text-xs mt-1 mb-0">{{ formErrors.user }}</p>
        <p v-if="formErrors.submit" class="text-red-500 text-xs mt-1 mb-0">{{ formErrors.submit }}</p>
      </div>
      
      <div class="flex gap-3 pt-4">
        <button 
          type="button"
          @click="handleClose"
          class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Procesando...</span>
          <span v-else>{{ isEditMode ? 'Actualizar' : 'Crear' }} Post</span>
        </button>
      </div>
    </form>
  </AppModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PostService } from '@/services/postService.js'
import AppModal from './AppModal.vue'

export default defineComponent({
  name: 'AppPostForm',
  components: {
    AppModal
  },
  props: {
    // Si el modal está visible
    isVisible: {
      type: Boolean,
      default: false
    },
    // Datos del post para edición
    post: {
      type: Object,
      default: null
    },
    // Usuario actual
    currentUser: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formData: {
        id: null,
        description: '',
        img_path: '',
        likes: 0
      },
      formErrors: {},
      isSubmitting: false
    }
  },
  computed: {
    isEditMode() {
      return this.formData.id !== null
    }
  },
  watch: {
    post: {
      handler(newPost) {
        if (newPost) {
          this.initializeForm(newPost)
        } else {
          this.resetForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    initializeForm(post) {
      this.formData = {
        id: post.id,
        description: post.description || '',
        img_path: post.img_path || '',
        likes: post.likes || 0
      }
    },

    resetForm() {
      this.formData = {
        id: null,
        description: '',
        img_path: '',
        likes: 0
      }
      this.formErrors = {}
    },

    validateForm() {
      this.formErrors = {}
      
      if (!this.formData.description.trim()) {
        this.formErrors.description = 'La descripción es requerida'
      }

      if (!this.isEditMode && !this.formData.img_path.trim()) {
        this.formErrors.img_path = 'La imagen es requerida'
      }

      return Object.keys(this.formErrors).length === 0
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      this.isSubmitting = true
      this.formErrors = {}

      try {
        console.log("currentUser:", this.currentUser, "------------------------currentUser")
        const postData = {
          description: this.formData.description.trim(),
          user_id: this.currentUser?.id,
          img_path: this.formData.img_path,
          likes: this.formData.likes
        }
        console.log(postData,"------------------------postData")
        let response
        if (this.isEditMode) {
          postData.id = this.formData.id
          response = await PostService.updatePost(this.formData.id, postData)
        } else {
          response = await PostService.createPost(postData)
        }

        if (response.error) {
          this.formErrors.submit = response.error
        } else {
          this.resetForm()
          this.$emit('post-saved', response.data)
        }
      } catch (err) {
        this.formErrors.submit = err instanceof Error ? err.message : 'Error desconocido'
      } finally {
        this.isSubmitting = false
      }
    },

    handleClose() {
      this.resetForm()
      this.$emit('close')
    }
  },
  emits: ['post-saved', 'close']
})
</script>
