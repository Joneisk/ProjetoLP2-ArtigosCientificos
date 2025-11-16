<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { CATEGORIES } from '@/types';

const props = defineProps<{
  searchQuery: string;
  category: string;
}>();

const emit = defineEmits<{
  'update:searchQuery': [value: string];
  'update:category': [value: string];
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div class="relative">
      <Search
        :size="20"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        :value="searchQuery"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        placeholder="Pesquisar artigos por título, palavras-chave ou autores..."
        class="input pl-10"
      />
    </div>

    <div>
      <select
        :value="category"
        @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
        class="select"
      >
        <option value="all">Todas as Categorias</option>
        <option v-for="cat in CATEGORIES" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>
  </div>
</template>