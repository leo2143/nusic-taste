<script lang="ts">
import { defineComponent } from 'vue'
import { PostService } from '@/services/postService'
import { CommentService } from '@/services/commentService'
import { store } from '@/lib/store'
import { AuthService } from '@/services/authService'
import AppStateDisplay from '@/components/AppStateDisplay.vue'
import AppPostItem from '@/components/AppPostItem.vue'
import AppPostForm from '../../components/AppPostForm.vue'
import type { Post, User, Comment } from '@/models'

export default defineComponent({
  name: 'AppPosts',
  components: {
    AppStateDisplay,
    AppPostItem,
    AppPostForm
},
  data() {
    return {
      posts: [] as Post[],
      user: null as User | null,
      postComments: {} as Record<number, Comment[]>, // Comentarios por post
      loading: false,
      error: null,
      showPostForm: false,
      editingPost: null as Post | null,
      isEditMode: false
    }
  },
  
  computed: {
    hasPosts() {
      return this.posts && this.posts.length > 0
    },
    isEmpty() {
      return !this.loading && !this.error && !this.hasPosts
    },
    currentUser() {
      return store.state.user
    },
    currentState() {
      if (this.loading) return 'loading'
      if (this.error) return 'error'
      if (this.isEmpty) return 'empty'
      return 'success'
    }
  },
  methods: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await PostService.getAllPosts()
        
        if (response.error) {
          this.error = response.error
          this.posts = []
        } else {
          this.posts = response.data || []
          
          if (this.posts.length > 0) {
            // Cargar comentarios para cada post
            await this.loadCommentsForAllPosts()
          }
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error desconocido al cargar los posts'
        this.posts = []
      } finally {
        this.loading = false
      }
    },
    // Métodos para manejar eventos del componente AppPostItem
    sharePost(post) {
      // TODO: Implementar lógica de compartir
      console.log('Share post:', post)
    },

    viewPost(post) {
      // TODO: Implementar lógica de ver post
      console.log('View post:', post)
    },
    // Método para cargar comentarios de todos los posts
    async loadCommentsForAllPosts() {
      for (const post of this.posts) {
        await this.loadCommentsForPost(post.id)
      }
    },

    // Método para cargar comentarios de un post específico (ASÍNCRONO)
    async loadCommentsForPost(postId) {
      try {
        const response = await CommentService.getCommentsByPost(postId)
        if (response.data) {
          this.postComments[postId] = response.data
        } else {
          this.postComments[postId] = []
        }
      } catch (err) {
        console.error(`Error cargando comentarios para post ${postId}:`, err)
        this.postComments[postId] = []
      }
    },

    // Método para obtener comentarios de un post específico (SÍNCRONO)
    getPostComments(postId) {
      return this.postComments[postId] || []
    },


    // Método para manejar cuando se crea un comentario
    handleCommentCreated(newComment) {
      const postId = newComment.post_id
      if (!this.postComments[postId]) {
        this.postComments[postId] = []
      }
      this.postComments[postId].push(newComment)
    },

    // Método para manejar cuando se elimina un comentario
    handleCommentDeleted(commentId, postId) {
      if (this.postComments[postId]) {
        this.postComments[postId] = this.postComments[postId].filter(
          comment => comment.id !== commentId
        )
      }
    },

    // Método para manejar cuando se da like a un post
    handleLikeToggled(postId, likeData) {
      // Actualizar el conteo de likes en el post correspondiente
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.likes = likeData.likes_count || 0
      }
    },
    async retryFetch() {
      await this.fetchPosts()
    },

    // Método para crear un nuevo post
    createNewPost() {
      this.editingPost = null
      this.isEditMode = false
      this.showPostForm = true
    },

    // Método para editar un post
    editPost(post: Post) {
      this.editingPost = post
      this.isEditMode = true
      this.showPostForm = true
    },

    // Método para manejar cuando se guarda un post
    handlePostSaved(postData: Post) {
      if (this.isEditMode) {
        // Actualizar post existente
        const index = this.posts.findIndex(p => p.id === postData.id)
        if (index !== -1) {
          this.posts[index] = postData
        }
      } else {
        // Agregar nuevo post
        this.posts.unshift(postData)
      }
      this.showPostForm = false
      this.editingPost = null
      this.isEditMode = false
    },

    // Método para manejar cerrar el formulario
    handleClosePostForm(): void {
      this.showPostForm = false
      this.editingPost = null
      this.isEditMode = false
    },

    // Método para ver un post (placeholder)
    viewPost(post: Post) {
      console.log('Ver post:', post)
      // Aquí se podría implementar una vista detallada del post
    },

    // Método para compartir un post (placeholder)
    sharePost(post: Post) {
      console.log('Compartir post:', post)
    },

    // Método para eliminar un post
    async deletePost(postId: number) {
      if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
        const result = await PostService.deletePost(postId)
        if (result.success) {
          // Remover el post de la lista
          this.posts = this.posts.filter(p => p.id !== postId)
          // Remover comentarios del post eliminado
          delete this.postComments[postId]
        } else {
          alert('Error al eliminar el post: ' + result.error)
        }
      }
    }
  },
  async mounted() {
    // Cargar datos del usuario si no están disponibles
    if (!this.user) {
      const userData = await AuthService.getCurrentSession()
      this.user = userData.user
    }
    await this.fetchPosts()
  }
})
</script>

<template>
<section class="max-w-2xl mx-auto p-5">
  <!-- Estados de carga, error y vacío -->
  <button 
        v-if="currentUser"
        @click="createNewPost"
        class="bg-blue-600 text-white w-full h-15 px-4 py-2 rounded-md text-sm transition-colors hover:bg-blue-700 mb-4"
      >
        + Crear nuevo post
      </button>

  <AppStateDisplay
    :state="currentState"
    :loading-text="'Cargando posts...'"
    :error-title="'Error al cargar los posts'"
    :error-message="error"
    :empty-icon="'📝'"
    :empty-title="'No hay posts disponibles'"
    :empty-message="'No se encontraron posts para mostrar en este momento.'"
    :retry-text="'Reintentar'"
    @retry="retryFetch"
  >
    <!-- Estado con datos -->
    <div v-if="hasPosts" class="flex flex-col gap-5">
      <AppPostItem
        v-for="post in posts" 
        :key="post.id"
        :post="post"
        :comments="getPostComments(post.id)"
        :current-user="currentUser"
        :current-user-id="currentUser?.id"
        :show-actions="false"
        :can-comment="true"
        @like-toggled="handleLikeToggled"
        @share="sharePost"
        @view="viewPost"
        @edit="editPost"
        @delete="deletePost"
        @comment-created="handleCommentCreated"
        @comment-deleted="handleCommentDeleted"
      />
    </div>
  </AppStateDisplay>

    <!-- Formulario de creación/edición de posts -->
    <AppPostForm
    :is-visible="showPostForm"
    :post="editingPost"
    :current-user="currentUser"
    @post-saved="handlePostSaved"
    @close="handleClosePostForm"
  />
</section>
</template>
