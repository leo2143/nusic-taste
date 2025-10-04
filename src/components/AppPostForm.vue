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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PostService } from '@/services/postService.js'
import AppModal from './AppModal.vue'
import type { Post, User, CreatePost, UpdatePost } from '@/models'

interface Props {
  isVisible?: boolean
  post?: Post | null
  currentUser?: User | null
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
  post: null,
  currentUser: null
})

const emit = defineEmits<{
  'post-saved': [post: Post]
  'close': []
}>()

interface FormData {
  id: number | null
  description: string
  img_path: string
  likes: number
}

interface FormErrors {
  description?: string
  img_path?: string
  user?: string
  submit?: string
}

const formData = ref<FormData>({
  id: null,
  description: '',
  img_path: '',
  likes: 0
})

const formErrors = ref<FormErrors>({})
const isSubmitting = ref(false)

const isEditMode = computed(() => {
  return formData.value.id !== null
})

const initializeForm = (post: Post) => {
  formData.value = {
    id: post.id,
    description: post.description || '',
    img_path: post.img_path || '',
    likes: post.likes || 0
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    description: '',
    img_path: '',
    likes: 0
  }
  formErrors.value = {}
}

const validateForm = (): boolean => {
  formErrors.value = {}
  
  if (!formData.value.description.trim()) {
    formErrors.value.description = 'La descripción es requerida'
  }

  if (!isEditMode.value && !formData.value.img_path.trim()) {
    formErrors.value.img_path = 'La imagen es requerida'
  }

  return Object.keys(formErrors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  formErrors.value = {}

  try {
    console.log("currentUser:", props.currentUser, "------------------------currentUser")
    const postData = {
      description: formData.value.description.trim(),
      user_id: props.currentUser?.id,
      img_path: formData.value.img_path,
      likes: formData.value.likes
    }
    console.log(postData,"------------------------postData")
    let response
    if (isEditMode.value) {
      (postData as UpdatePost).id = formData.value.id
      response = await PostService.updatePost(formData.value.id!, postData as UpdatePost)
    } else {
      response = await PostService.createPost(postData as CreatePost)
    }

    if (response.error) {
      formErrors.value.submit = response.error
    } else {
      resetForm()
      emit('post-saved', response.data)
    }
  } catch (err) {
    formErrors.value.submit = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  resetForm()
  emit('close')
}

// Watch for post changes
watch(() => props.post, (newPost) => {
  if (newPost) {
    initializeForm(newPost)
  } else {
    resetForm()
  }
}, { immediate: true })
</script>
