<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PostService } from '@/services/postService'
import { CommentService } from '@/services/commentService'
import { store } from '@/lib/store'
import { AuthService } from '@/services/authService'
import AppStateDisplay from '@/components/AppStateDisplay.vue'
import AppPostItem from '@/components/AppPostItem.vue'
import AppPostForm from '../../components/AppPostForm.vue'
import type { Post, User, Comment } from '@/models'

const posts = ref<Post[]>([])
const user = ref<User | null>(null)
const postComments = ref<Record<number, Comment[]>>({})
const loading = ref(false)
const error = ref<string | null>(null)
const showPostForm = ref(false)
const editingPost = ref<Post | null>(null)
const isEditMode = ref(false)

// Computed properties
const hasPosts = computed(() => posts.value && posts.value.length > 0)
const isEmpty = computed(() => !loading.value && !error.value && !hasPosts.value)
const currentUser = computed(() => store.state.user)
const currentState = computed(() => {
  if (loading.value) return 'loading'
  if (error.value) return 'error'
  if (isEmpty.value) return 'empty'
  return 'success'
})

// Methods
const fetchPosts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await PostService.getAllPosts()
    
    if (response.error) {
      error.value = response.error
      posts.value = []
    } else {
      posts.value = response.data || []
      
      if (posts.value.length > 0) {
        await loadCommentsForAllPosts()
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido al cargar los posts'
    posts.value = []
  } finally {
    loading.value = false
  }
}

const loadCommentsForAllPosts = async () => {
  for (const post of posts.value) {
    await loadCommentsForPost(post.id)
  }
}

const loadCommentsForPost = async (postId: number) => {
  try {
    const response = await CommentService.getCommentsByPost(postId)
    if (response.data) {
      postComments.value[postId] = response.data
    } else {
      postComments.value[postId] = []
    }
  } catch (err) {
    console.error(`Error cargando comentarios para post ${postId}:`, err)
    postComments.value[postId] = []
  }
}

const getPostComments = (postId: number) => {
  return postComments.value[postId] || []
}

const handleCommentCreated = (newComment: Comment) => {
  const postId = newComment.post_id
  if (!postComments.value[postId]) {
    postComments.value[postId] = []
  }
  postComments.value[postId].push(newComment)
}

const handleCommentDeleted = (commentId: number, postId: number) => {
  if (postComments.value[postId]) {
    postComments.value[postId] = postComments.value[postId].filter(
      comment => comment.id !== commentId
    )
  }
}

const handleLikeToggled = (postId: number, likeData: { liked: boolean; likes_count: number }) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.likes = likeData.likes_count || 0
  }
}

const retryFetch = async () => {
  await fetchPosts()
}

const createNewPost = () => {
  editingPost.value = null
  isEditMode.value = false
  showPostForm.value = true
}

const editPost = (post: Post) => {
  editingPost.value = post
  isEditMode.value = true
  showPostForm.value = true
}

const handlePostSaved = (postData: Post) => {
  if (isEditMode.value) {
    const index = posts.value.findIndex(p => p.id === postData.id)
    if (index !== -1) {
      posts.value[index] = postData
    }
  } else {
    posts.value.unshift(postData)
  }
  showPostForm.value = false
  editingPost.value = null
  isEditMode.value = false
}

const handleClosePostForm = () => {
  showPostForm.value = false
  editingPost.value = null
  isEditMode.value = false
}

const viewPost = (post: Post) => {
  console.log('Ver post:', post)
}

const sharePost = (post: Post) => {
  console.log('Compartir post:', post)
}

const deletePost = async (postId: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
    const result = await PostService.deletePost(postId)
    if (result.success) {
      posts.value = posts.value.filter(p => p.id !== postId)
      delete postComments.value[postId]
    } else {
      alert('Error al eliminar el post: ' + result.error)
    }
  }
}

// Lifecycle
onMounted(async () => {
  if (!user.value) {
    const userData = await AuthService.getCurrentSession()
    user.value = userData.user
  }
  await fetchPosts()
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
