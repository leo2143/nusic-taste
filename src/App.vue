<script lang="ts">
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppHeader />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>  
