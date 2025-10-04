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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppStateDisplay',
  props: {
    // Estado actual: 'loading', 'error', 'empty', 'success'
    state: {
      type: String,
      required: true,
      validator: (value) => ['loading', 'error', 'empty', 'success'].includes(value)
    },
    
    // Textos personalizables para estado de carga
    loadingText: {
      type: String,
      default: 'Cargando...'
    },
    
    // Textos personalizables para estado de error
    errorTitle: {
      type: String,
      default: 'Error'
    },
    errorMessage: {
      type: String,
      default: 'Ha ocurrido un error'
    },
    
    // Textos personalizables para estado vacío
    emptyIcon: {
      type: String,
      default: '📝'
    },
    emptyTitle: {
      type: String,
      default: 'No hay datos disponibles'
    },
    emptyMessage: {
      type: String,
      default: 'No se encontraron datos para mostrar en este momento.'
    },
    
    // Configuración del botón de reintentar
    showRetry: {
      type: Boolean,
      default: true
    },
    retryText: {
      type: String,
      default: 'Reintentar'
    }
  },
  
  emits: ['retry']
})
</script>
