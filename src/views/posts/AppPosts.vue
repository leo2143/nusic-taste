<script lang="ts">
import { defineComponent } from 'vue'
import { PostService } from '@/services/postService'

export default defineComponent({
  name: 'AppPosts',
  data() {
    return {
      posts: [],
      loading: false,
      error: null,
      hasData: false
    }
  },
  computed: {
    hasPosts() {
      return this.posts && this.posts.length > 0
    },
    isEmpty() {
      return !this.loading && !this.error && !this.hasPosts
    }
  },
  methods: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      this.hasData = false
      
      try {
        const response = await PostService.getAllPosts()
        
        if (response.error) {
          this.error = response.error
          this.posts = []
        } else {
          this.posts = response.data || []
          this.hasData = this.posts.length > 0
          
          // Validación adicional para datos vacíos
          if (!this.hasData) {
            this.error = 'No se encontraron posts disponibles'
          }
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error desconocido al cargar los posts'
        this.posts = []
        this.hasData = false
      } finally {
        this.loading = false
      }
    },

    async deletePost(id: number) {
      await PostService.deletePost(id)
    },

    async retryFetch() {
      await this.fetchPosts()
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Fecha desconocida'
      
      try {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now - date) / (1000 * 60))
        
        if (diffInMinutes < 1) return 'Ahora'
        if (diffInMinutes < 60) return `${diffInMinutes}m`
        
        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) return `${diffInHours}h`
        
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays}d`
        
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short'
        })
      } catch (error) {
        return 'Fecha inválida'
      }
    }
  },
  async mounted() {
    await this.fetchPosts()
    console.log(this.posts)
  }
})
</script>

<template>
<section class="posts-container">
    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando posts...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Error al cargar los posts</h3>
        <p>{{ error }}</p>
        <button @click="retryFetch" class="retry-button">
            Reintentar
        </button>
    </div>

    <!-- Estado vacío -->
    <div v-else-if="isEmpty" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No hay posts disponibles</h3>
        <p>No se encontraron posts para mostrar en este momento.</p>
        <button @click="retryFetch" class="retry-button">
            Actualizar
        </button>
    </div>

    <!-- Estado con datos -->
    <div v-else-if="hasPosts" class="posts-content">
        <div 
            v-for="post in posts" 
            :key="post.id" 
            class="post-item"
        >
            <!-- Información del usuario -->
            <div class="post-header">
                <div class="user-info">
                    <div class="profile-image">
                        <img 
                            :src="post.user?.profile_image || 'https://via.placeholder.com/40x40/3498db/ffffff?text=' + (post.user?.nick_name?.charAt(0) || 'U')" 
                            :alt="`Avatar de ${post.user?.nick_name || 'Usuario'}`"
                            class="avatar"
                        >
                    </div>
                    <div class="user-details">
                        <h3 class="user-nickname">
                            {{ post.user?.nick_name || 'Usuario desconocido' }}
                        </h3>
                        <p class="post-time">
                            {{ formatDate(post.created_at) }}
                        </p>
                    </div>
                </div>  
                
                <div class="post-actions">
                    <button class="action-button" title="Eliminar" @click="deletePost(post.id)">
                        🗑️
                    </button>
                    <button class="action-button" title="Editar">
                        ✏️
                    </button>
                    <button class="action-button" title="Ver">
                        👁️
                    </button>
                </div>
            </div>

            <!-- Contenido del post -->
            <div class="post-content">
                <p class="post-description">
                    {{ post.description || 'Sin descripción' }}
                </p>
                <div v-if="post.img_path" class="post-image">
                    <img 
                        :src="post.img_path" 
                        :alt="`Imagen del post de ${post.user?.nick_name}`"
                        class="post-img"
                    >
                </div>
            </div>

            <!-- Interacciones del post -->
            <div class="post-interactions">
                <button class="like-button" :class="{ 'liked': false }">
                    ❤️ {{ post.likes || 0 }}
                </button>
                <button class="comment-button">
                    💬 Comentar
                </button>
                <button class="share-button">
                    📤 Compartir
                </button>
            </div>

            <!-- Comentarios del post -->
            <div class="post-comments">
                <div class="comment-item">
                    <div class="comment-user">
                        <img 
                            src="https://via.placeholder.com/32x32/95a5a6/ffffff?text=U" 
                            alt="Avatar del comentario"
                            class="comment-avatar"
                        >
                        <div class="comment-details">
                            <h4 class="comment-nickname">Usuario</h4>
                            <p class="comment-time">12m</p>
                        </div>
                    </div>
                    <p class="comment-text">Comentario de ejemplo</p>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<style scoped>
.posts-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

/* Estados de carga, error y vacío */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3,
.empty-state h3 {
  color: #e74c3c;
  margin-bottom: 8px;
}

.empty-state h3 {
  color: #95a5a6;
}

.retry-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 16px;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background: #2980b9;
}

/* Contenido de posts */
.posts-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ecf0f1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.post-time {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.action-button:hover {
  background: #ecf0f1;
}

.post-content {
  padding: 16px;
}

.post-description {
  margin: 0 0 12px 0;
  line-height: 1.5;
  color: #2c3e50;
}

.post-image {
  margin-top: 12px;
}

.post-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.post-interactions {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid #ecf0f1;
}

.like-button,
.comment-button,
.share-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #7f8c8d;
  transition: color 0.3s;
}

.like-button:hover,
.comment-button:hover,
.share-button:hover {
  color: #3498db;
}

.like-button.liked {
  color: #e74c3c;
}

.post-comments {
  padding: 16px;
  background: #f8f9fa;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.comment-item:last-child {
  margin-bottom: 0;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-details h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.comment-time {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.comment-text {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .posts-container {
    padding: 10px;
  }
  
  .post-header {
    padding: 12px;
  }
  
  .post-content {
    padding: 12px;
  }
  
  .post-interactions {
    padding: 8px 12px;
  }
  
  .post-comments {
    padding: 12px;
  }
}
</style>