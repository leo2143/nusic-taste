<script lang="ts">
import { defineComponent } from 'vue'
import { PostService } from '@/services/postService.js'
import {AuthService} from '@/services/authService.js'
import { CommentService } from '@/services/commentService.js'
import { UserService } from '@/services/userService.js'
import AppStateDisplay from '@/components/AppStateDisplay.vue'
import AppPostItem from '@/components/AppPostItem.vue'
import AppPostForm from '@/components/AppPostForm.vue'

import { store } from '@/lib/store.js'

export default defineComponent({
  name: 'AppUser',
  components: {
    AppStateDisplay,
    AppPostItem,
    AppPostForm
  },
  data() {
    return {
      posts: [],
      user: null,
      postComments: {}, // Comentarios por post
      loading: false,
      error: null,
      isCurrentUserProfile: false,
      isEditMode: false,
      editingPost: null,
      showPostForm: false
    }
  },
  props: {
    nick_name: {
      type: String,
      required: true
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
  watch: {
    // ✅ Watcher para el prop nick_name
    nick_name: {
      handler(newNickName, oldNickName) {
        if (newNickName && newNickName !== oldNickName) {
          console.log('nick_name cambió de', oldNickName, 'a', newNickName)
          this.fetchPosts()
        }
      },
      immediate: false // No ejecutar inmediatamente, ya se ejecuta en mounted
    }
  },
  methods: {
  
    async fetchPosts() {
      this.loading = true
      this.error = null
      
      try {
        await this.handeUserProfile()

        const response = await PostService.getPostsByUserId(this.user?.id)
        
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


    async handeUserProfile() {
      if (this.user?.nick_name !== this.nick_name) {
        this.isCurrentUserProfile = false
        const response = await UserService.getUserByNickName(this.nick_name)
        
        if (response.data) {
          this.user = response.data
        } else {
          this.error = response.error || 'Usuario no encontrado'
          this.user = null
        }
      } else {
        this.isCurrentUserProfile = true
      }
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

    // Métodos para manejar eventos del componente AppPostItem

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

    // Método para manejar cuando se guarda un post
    handlePostSaved(postData) {
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
    handleClosePostForm() {
      this.showPostForm = false
      this.editingPost = null
      this.isEditMode = false
    },


    async deletePost(id) {
      if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
        const result = await PostService.deletePost(id)
        if (result.success) {
          await this.fetchPosts()
        } else {
          alert('Error al eliminar el post: ' + result.error)
        }
      }
    },

    async retryFetch() {
      await this.fetchPosts()
    },




    // Método para editar un post
    editPost(post) {
      this.editingPost = post
      this.isEditMode = true
      this.showPostForm = true
    },

    // Método para crear un nuevo post
    createNewPost() {
      this.editingPost = null
      this.isEditMode = false
      this.showPostForm = true
    },

    // Método para ver un post (placeholder)
    viewPost(post) {
      console.log('Ver post:', post)
      // Aquí se podría implementar una vista detallada del post
    },

    // Método para compartir un post (placeholder)
    sharePost(post) {
      console.log('Compartir post:', post)

    }
  },
  async mounted() {
    const userData = await AuthService.getCurrentSession()
    this.user = userData.user
    // Asegurar que el store también tenga el usuario
    if (userData.user) {
      store.setUser(userData.user)
    }
    await this.fetchPosts()
  }
      
})
</script>

<template>
<section class="max-w-2xl mx-auto p-5">
  <div class="flex items-center gap-5 bg-white p-5 rounded-xl shadow-md mb-5">
    <div class="flex-shrink-0">
      <img 
        :src="user?.profile_image || '/default-avatar.svg'" 
        alt="Profile Image"
        class="w-20 h-20 rounded-full object-cover"
        @error="handleImageError"
      >
    </div>
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold text-gray-800 mb-1 truncate">{{user?.nick_name}}</h2>
      <p class="text-sm text-gray-600">email: {{ user?.email }}</p>
    </div>
    <div v-if="isCurrentUserProfile" class="flex gap-3">
      <button 
        @click="createNewPost"
        class="bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors hover:bg-green-700"
      >
        + Nuevo Post
      </button>
      <router-link 
        :to="`/user/detail/${user?.nick_name}`"
        class="bg-blue-600 text-white no-underline px-5 py-2.5 rounded-md text-sm transition-colors hover:bg-blue-700"
      >
        Editar perfil
      </router-link>
    </div>
  </div>

  <!-- Estados de carga, error y vacío -->
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
    <div v-if="hasPosts" class="space-y-6">
      <AppPostItem
        v-for="post in posts" 
        :key="post.id"
        :post="post"
        :comments="getPostComments(post.id)"
        :current-user="currentUser"
        :current-user-id="currentUser?.id"
        :show-actions="isCurrentUserProfile"
        :can-comment="true"
        @delete="deletePost"
        @edit="editPost"
        @view="viewPost"
        @like-toggled="handleLikeToggled"
        @share="sharePost"
        @comment-created="handleCommentCreated"
        @comment-deleted="handleCommentDeleted"
      />
    </div>
  
  <!-- Formulario de creación/edición de posts -->
  <AppPostForm
    :is-visible="showPostForm"
    :post="editingPost"
    :current-user="currentUser"
    @post-saved="handlePostSaved"
    @close="handleClosePostForm"
  />


  
  </AppStateDisplay>
</section>
</template>
