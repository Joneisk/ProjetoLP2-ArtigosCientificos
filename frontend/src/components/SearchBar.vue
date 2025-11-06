<!-- SearchBar.vue -->
<template>
  <div class="w-full space-y-4">
    <!-- Campo de busca -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Pesquisar artigos por título, palavras-chave ou autores..."
        :value="searchQuery"
        @input="onSearchChange($event.target.value)"
        class="pl-10 h-12"
      />
    </div>

    <!-- Filtro de categoria -->
    <div class="flex gap-3">
      <Select :model-value="category" @update:model-value="onCategoryChange">
        <SelectTrigger class="w-[200px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Categorias</SelectItem>
          <SelectItem value="Medicina">Medicina</SelectItem>
          <SelectItem value="Física">Física</SelectItem>
          <SelectItem value="Biologia">Biologia</SelectItem>
          <SelectItem value="Engenharia">Engenharia</SelectItem>
          <SelectItem value="Neurociência">Neurociência</SelectItem>
          <SelectItem value="Computação">Computação</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.vue'

// Props (iguais ao React)
const props = defineProps({
  searchQuery: { type: String, required: true },
  onSearchChange: { type: Function, required: true },
  category: { type: String, required: true },
  onCategoryChange: { type: Function, required: true },
})
</script>
