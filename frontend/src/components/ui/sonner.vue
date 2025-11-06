<!-- Toaster.vue -->
<template>
  <Sonner
    class="toaster group"
    :theme="resolvedTheme"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
    }"
    v-bind="attrs"
  />
</template>

<script setup>
import { useColorMode } from '@vueuse/core'
import { Toaster as Sonner } from 'vue-sonner'

const attrs = useAttrs()

// 🔹 Substitui o useTheme do Next.js
const mode = useColorMode({
  emitAuto: true,
  initialValue: 'system',
})

const resolvedTheme = computed(() => mode.value || 'system')
</script>
