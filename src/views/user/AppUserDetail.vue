<template>
  <section class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">
        {{ userDetail ? userDetail.name + ' ' + userDetail.last_name : 'User Detail' }}
      </h1>
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <span class="text-blue-600 font-semibold">Loading...</span>
      </div>
      <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-4">
        {{ error }}
      </div>
      <div v-else-if="userDetail" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600">Name</label>
            <p class="text-lg text-gray-900">{{ userDetail.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Last Name</label>
            <p class="text-lg text-gray-900">{{ userDetail.last_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Nickname</label>
            <p class="text-lg text-gray-900">{{ userDetail.nick_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Email</label>
            <p class="text-lg text-gray-900">{{ userDetail.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Age</label>
            <p class="text-lg text-gray-900">{{ userDetail.age }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Gender</label>
            <p class="text-lg text-gray-900">{{ userDetail.gender }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">User UUID</label>
            <p class="text-lg text-gray-900 break-all">{{ userDetail.user_id }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">No user data found.</div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import supabase from '@/lib/supabaseClient.js'
import type { User } from '@/models/User'

export default defineComponent({
  name: 'AppUserDetail',
  props: {
    id: {
      type: [String, Number] as PropType<string | number>,
      required: true
    }
  },
  data() {
    return {
      userDetail: null as User | null,
      isLoading: false,
      error: null as string | null
    }
    },

  emits: [],
  methods: {
    /**
     * Obtiene el detalle del usuario desde Supabase
     */
    async fetchUserDetail() {
      this.isLoading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from<User>('users')
          .select('*')
          .eq('id', this.id)
          .single()
        if (error) throw error
        this.userDetail = data
      } catch (err: any) {
        this.error = err.message || 'Error fetching user detail'
        this.userDetail = null
      } finally {
        this.isLoading = false
      }
    }
  },
    async mounted() {
    console.log(this.id)
    await this.fetchUserDetail()
  },
  watch: {
    id: {
      immediate: false,
      handler() {
        this.fetchUserDetail()
      }
    }
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f9fafb;
}
</style>
