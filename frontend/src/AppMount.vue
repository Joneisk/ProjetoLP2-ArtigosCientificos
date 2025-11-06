<template>
  <div :class="{ dark: isDarkMode }" class="transition-colors duration-300">
    <App />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import App from './App.vue'

// Estado de tema global
const isDarkMode = ref(
  localStorage.getItem('theme') === 'dark' ||
  window.matchMedia('(prefers-color-scheme: dark)').matches
)

// Atualiza <html> e salva preferência
watchEffect(() => {
  const html = document.documentElement
  if (isDarkMode.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
})
</script>
