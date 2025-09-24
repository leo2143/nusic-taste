<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { supabase } from './lib/supabaseClient'

const instruments = ref([])

async function getInstruments() {
  const { data } = await supabase.from('instruments').select()
  instruments.value = data
}

onMounted(() => {
  getInstruments()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Music Instruments</h1>

      <div v-if="instruments.length === 0" class="text-center py-8">
        <p class="text-gray-600">Loading instruments...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="instrument in instruments"
          :key="instrument.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ instrument.name }}</h3>
          <p v-if="instrument.description" class="text-gray-600">{{ instrument.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
