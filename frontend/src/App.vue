<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
</script>

<template>
  <div id="app">
    <RouterView />
    <Toaster position="top-right" :duration="3000" />
  </div>
</template>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>