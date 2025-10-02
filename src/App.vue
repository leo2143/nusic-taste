<script lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter /> 
  </div>
</template>

<style scoped></style>  
