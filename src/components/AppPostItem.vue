<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
    <!-- Información del usuario -->
    <div class="flex justify-between items-start mb-4">
    <router-link :to="`/user/${post.user?.nick_name}`">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <img 
            :src="post.user?.profile_image || '/default-avatar.svg'" 
            :alt="`Avatar de ${post.user?.nick_name || 'Usuario'}`"
            class="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            @error="handleImageError"
          >
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 truncate">
            {{ post.user?.nick_name || 'Usuario desconocido' }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ formatDate(post.created_at) }}
          </p>
        </div>
      </div>  
    </router-link>
      
      <div class="flex space-x-2" v-if="showActions">
        <button 
          class="p-2 text-gray-400 hover:text-red-500 transition-colors" 
          title="Eliminar" 
          @click="$emit('delete', post.id)"
        >
          🗑️
        </button>
        <button 
          class="p-2 text-gray-400 hover:text-blue-500 transition-colors" 
          title="Editar" 
          @click="$emit('edit', post)"
        >
          ✏️
        </button>
        <button 
          class="p-2 text-gray-400 hover:text-green-500 transition-colors" 
          title="Ver"
          @click="$emit('view', post)"
        >
          👁️
        </button>
      </div>
    </div>

    <!-- Contenido del post -->
    <div class="mb-4">
      <p class="text-gray-800 text-base leading-relaxed mb-4">
        {{ post.description || 'Sin descripción' }}
      </p>
      <div v-if="post.img_path" class="rounded-lg overflow-hidden">
        <img 
          :src="post.img_path" 
          :alt="`Imagen del post de ${post.user?.nick_name}`"
          class="w-full h-auto max-h-96 object-cover"
          @error="handleImageError"
        >
      </div>
    </div>

    <!-- Interacciones del post -->
    <div class="flex items-center space-x-6 py-3 border-t border-gray-100">
      <button 
        class="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
        :class="{ 'text-red-500': isLiked, 'opacity-50 cursor-not-allowed': isLiking }"
        @click="handleLikePost"
        :disabled="isLiking"
      >
        <span class="text-lg">{{ isLiking ? '⏳' : '❤️' }}</span>
        <span class="text-sm font-medium">{{ likesCount }}</span>
      </button>
      <button 
        class="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
        @click="toggleComments"
      >
        <span class="text-lg">💬</span>
        <span class="text-sm font-medium">{{ comments.length }} Comentarios</span>
      </button>
      <button 
        class="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
        @click="$emit('share', post)"
      >
        <span class="text-lg">📤</span>
        <span class="text-sm font-medium">Compartir</span>
      </button>
    </div>

    <!-- Comentarios del post -->
    <div v-if="showComments" class="mt-4 pt-4 border-t border-gray-100">
      <!-- Formulario para nuevo comentario -->
      <form @submit.prevent="handleCreateComment" class="mb-4" v-if="canComment">
        <div class="flex space-x-3">
          <img 
            :src="currentUser?.profile_image || '/default-avatar.svg'" 
            :alt="`Avatar de ${currentUser?.nick_name || 'Usuario'}`"
            class="w-8 h-8 rounded-full object-cover border border-gray-200"
            @error="handleImageError"
          >
          <div class="flex-1">
            <textarea 
              v-model="newCommentText"
              placeholder="Escribe un comentario..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              required
            ></textarea>
            <div class="flex justify-end mt-2">
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="!newCommentText?.trim()"
              >
                Comentar
              </button>
            </div>
          </div>
        </div>
      </form>

      <!-- Lista de comentarios -->
      <div v-if="comments.length > 0" class="space-y-4">
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="flex space-x-3"
        >
          <img 
            :src="comment.user?.profile_image || '/default-avatar.svg'" 
            :alt="`Avatar de ${comment.user?.nick_name || 'Usuario'}`"
            class="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
            @error="handleImageError"
          >
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-1">
              <h4 class="text-sm font-semibold text-gray-900">{{ comment.user?.nick_name || 'Usuario' }}</h4>
              <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-800 leading-relaxed">{{ comment.comment }}</p>
          </div>
          <button 
            v-if="canDeleteComment(comment)"
            class="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            @click="handleDeleteComment(comment.id)"
            title="Eliminar comentario"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- Mensaje cuando no hay comentarios -->
      <div v-else class="text-center py-4">
        <p class="text-gray-500 text-sm">No hay comentarios aún. ¡Sé el primero en comentar!</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Post, CommentWithUser, User, CreateComment } from '@/models'
import { CommentService } from '@/services/commentService'
import { LikePostService } from '@/services/likePostService'

export default defineComponent({
  name: 'AppPostItem',
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    },
    comments: {
      type: Array as PropType<CommentWithUser[]>,
      default: () => []
    },
    currentUser: {
      type: Object as PropType<User | null>,
      default: null
    },
    currentUserId: {
      type: [String, Number],
      default: null
    },
    showActions: {
      type: Boolean,
      default: false
    },
    canComment: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showComments: false,
      newCommentText: '',
      isLiked: false,
      likesCount: 0,
      isLiking: false
    }
  },
  async mounted() {
    this.initializeLikeState()
  },
  watch: {
    post: {
      handler() {
        this.initializeLikeState()
      },
      immediate: true
    },
    currentUserId: {
      handler() {
        this.initializeLikeState()
      }
    }
  },
  methods: {
    async initializeLikeState() {
      this.likesCount = this.post.likes || 0
      if (this.currentUserId) {
        await this.checkLikeStatus()
      } else {
        this.isLiked = false
      }
    },

    async checkLikeStatus() {
      if (!this.currentUserId) return
      
      try {
        const response = await LikePostService.checkUserLikedPost(String(this.currentUserId), this.post.id)
        if (!response.error) {
          this.isLiked = response.liked
        }
      } catch (error) {
        console.error('Error checking like status:', error)
      }
    },

    toggleComments() {
      this.showComments = !this.showComments
    },
    
    async handleCreateComment() {
      const commentText = this.newCommentText?.trim()
      if (!commentText || !this.currentUserId) return

      try {
        const commentData = {
          comment: commentText,
          post_id: this.post.id,
          user_id: String(this.currentUserId)
        } as CreateComment;

        const response = await CommentService.createComment(commentData)
        
        if (!response.error && response.data) {
          // Emitir evento para que el componente padre actualice la lista
          this.$emit('comment-created', response.data)
          this.newCommentText = ''
        } else {
          console.error('Error creando comentario:', response.error)
          alert('Error al crear el comentario: ' + response.error)
        }
      } catch (err) {
        console.error('Error creando comentario:', err)
        alert('Error al crear el comentario')
      }
    },
    
    canDeleteComment(comment: CommentWithUser): boolean {
      return String(this.currentUser?.id) === String(comment.user?.id) || this.showActions
    },

    async handleDeleteComment(commentId) {
      if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        try {
          const result = await CommentService.deleteComment(commentId)
          if (result.success) {
            // Emitir evento para que el componente padre actualice la lista
            this.$emit('comment-deleted', commentId, this.post.id)
          } else {
            console.error('Error eliminando comentario:', result.error)
            alert('Error al eliminar el comentario')
          }
        } catch (err) {
          console.error('Error eliminando comentario:', err)
          alert('Error al eliminar el comentario')
        }
      }
    },

    async handleLikePost() {
      if (!this.currentUserId || this.isLiking) return

      this.isLiking = true

      try {
        const response = await LikePostService.toggleLikePost(String(this.currentUserId), this.post.id)
        
        if (response.error) {
          console.error('Error al dar like:', response.error)
          alert('Error al dar like al post')
        } else {
          // Actualizar estado local inmediatamente
          this.isLiked = response.liked
          
          // Obtener el conteo actualizado de likes
          const countResponse = await LikePostService.countLikesByPost(this.post.id)
          
          if (!countResponse.error) {
            this.likesCount = countResponse.count
          }
          
          // Emitir evento para que el componente padre actualice el estado del post
          this.$emit('like-toggled', this.post.id, { 
            liked: response.liked,
            likes_count: this.likesCount
          })
        }
      } catch (err) {
        console.error('Error al dar like:', err)
        alert('Error al dar like al post')
      } finally {
        this.isLiking = false
      }
    },
    
    formatDate(dateString: string): string {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
      
      if (diffInSeconds < 60) {
        return 'hace un momento'
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `hace ${hours} hora${hours > 1 ? 's' : ''}`
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400)
        return `hace ${days} día${days > 1 ? 's' : ''}`
      } else {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    },
    
    handleImageError(event: Event) {
      const img = event.target as HTMLImageElement
      img.src = '/default-avatar.svg'
    }
  },
  emits: [
    'delete',
    'edit', 
    'view',
    'like-toggled',
    'share',
    'comment-created',
    'comment-deleted'
  ]
})
</script>
