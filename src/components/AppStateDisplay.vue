<template>
  <div class="flex flex-col items-center justify-center min-h-[200px] p-8">
    <!-- Estado de carga -->
    <div v-if="state === 'loading'" class="flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="text-blue-600 font-semibold text-lg">{{ loadingText }}</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="state === 'error'" class="flex flex-col items-center gap-4 text-center max-w-md">
      <div class="text-5xl">⚠️</div>
      <h3 class="text-red-600 text-2xl font-semibold m-0">{{ errorTitle }}</h3>
      <p class="text-gray-600 text-base m-0">{{ errorMessage }}</p>
      <button 
        v-if="showRetry" 
        @click="$emit('retry')" 
        class="bg-blue-600 text-white border-none px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ retryText }}
      </button>
    </div>

    <!-- Estado vacío -->
    <div v-else-if="state === 'empty'" class="flex flex-col items-center gap-4 text-center max-w-md">
      <div class="text-5xl">{{ emptyIcon }}</div>
      <h3 class="text-gray-700 text-2xl font-semibold m-0">{{ emptyTitle }}</h3>
      <p class="text-gray-600 text-base m-0">{{ emptyMessage }}</p>
      <button 
        v-if="showRetry" 
        @click="$emit('retry')" 
        class="bg-blue-600 text-white border-none px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ retryText }}
      </button>
    </div>

    <!-- Estado de éxito (contenido) -->
    <div v-else-if="state === 'success'" class="w-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  state: 'loading' | 'error' | 'empty' | 'success'
  loadingText?: string
  errorTitle?: string
  errorMessage?: string
  emptyIcon?: string
  emptyTitle?: string
  emptyMessage?: string
  showRetry?: boolean
  retryText?: string
}

const props = withDefaults(defineProps<Props>(), {
  loadingText: 'Cargando...',
  errorTitle: 'Error',
  errorMessage: 'Ha ocurrido un error',
  emptyIcon: '📝',
  emptyTitle: 'No hay datos disponibles',
  emptyMessage: 'No se encontraron datos para mostrar en este momento.',
  showRetry: true,
  retryText: 'Reintentar'
})

const emit = defineEmits<{
  retry: []
}>()
</script>
