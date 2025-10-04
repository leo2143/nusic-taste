<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div 
      class="fixed inset-0 bg-black/50 transition-opacity"
      @click="handleOverlayClick"
    ></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div 
        class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto transform transition-all"
        :class="modalSize"
      >
        <!-- Header -->
        <div v-if="showHeader" class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <button 
            v-if="showCloseButton"
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div v-if="showFooter" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <slot name="footer">
            <button 
              v-if="showCancelButton"
              @click="close"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button 
              v-if="showConfirmButton"
              @click="confirm"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(value)
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    showConfirmButton: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    modalSize() {
      const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl'
      }
      return sizes[this.size] || sizes.md
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    
    confirm() {
      this.$emit('confirm')
    },
    
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.close()
      }
    }
  },
  emits: ['close', 'confirm']
})
</script>
