<!-- src/components/ArticleFormDialog.vue -->
<template>
  <Dialog :open="props.open" @update:open="props.onOpenChange">
    <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {{ props.editingArticle ? 'Editar Artigo' : 'Publicar Novo Artigo' }}
        </DialogTitle>
        <DialogDescription>
          Preencha os dados do seu artigo científico.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Título -->
        <div class="space-y-2">
          <Label for="title">Título do Artigo</Label>
          <Input
            id="title"
            type="text"
            placeholder="Digite o título do artigo"
            v-model="title"
            required
          />
        </div>

        <!-- Categoria -->
        <div class="space-y-2">
          <Label for="category">Categoria</Label>
          <Select v-model="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medicina">Medicina</SelectItem>
              <SelectItem value="Física">Física</SelectItem>
              <SelectItem value="Biologia">Biologia</SelectItem>
              <SelectItem value="Engenharia">Engenharia</SelectItem>
              <SelectItem value="Neurociência">Neurociência</SelectItem>
              <SelectItem value="Computação">Computação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Resumo -->
        <div class="space-y-2">
          <Label for="abstract">Resumo (Abstract)</Label>
          <Textarea
            id="abstract"
            placeholder="Digite o resumo do artigo"
            v-model="abstract"
            rows="3"
            required
          />
        </div>

        <!-- Conteúdo -->
        <div class="space-y-2">
          <Label for="content">Conteúdo Completo</Label>
          <Textarea
            id="content"
            placeholder="Digite o conteúdo completo do artigo"
            v-model="content"
            rows="8"
            required
          />
        </div>

        <!-- Autores -->
        <div class="space-y-2">
          <Label for="authors">Autores</Label>
          <Input
            id="authors"
            type="text"
            placeholder="Autor 1, Autor 2, Autor 3"
            v-model="authors"
            required
          />
          <p class="text-xs text-gray-500">Separe os autores por vírgula</p>
        </div>

        <!-- Palavras-chave -->
        <div class="space-y-2">
          <Label for="keywords">Palavras-chave</Label>
          <Input
            id="keywords"
            type="text"
            placeholder="Palavra1, Palavra2, Palavra3"
            v-model="keywords"
            required
          />
          <p class="text-xs text-gray-500">Separe as palavras-chave por vírgula</p>
        </div>

        <!-- Ações -->
        <div class="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" @click="props.onOpenChange(false)">
            Cancelar
          </Button>
          <Button type="submit">
            {{ props.editingArticle ? 'Atualizar' : 'Publicar' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// UI Components (nomes padronizados em lowercase para compatibilidade com Vite)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog.vue'
import { Input } from '@/components/ui/input.vue'
import { Label } from '@/components/ui/label.vue'
import { Button } from '@/components/ui/button.vue'
import { Textarea } from '@/components/ui/textarea.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.vue'

// Props tipadas
const props = defineProps<{
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (article: any) => void
  editingArticle?: any | null
}>()

// Campos do formulário
const title = ref('')
const abstract = ref('')
const content = ref('')
const authors = ref('')
const keywords = ref('')
const category = ref('')

// Resetar formulário
function resetForm() {
  title.value = ''
  abstract.value = ''
  content.value = ''
  authors.value = ''
  keywords.value = ''
  category.value = ''
}

// Preenche automaticamente quando abre para edição
watch(
  () => [props.editingArticle, props.open],
  () => {
    if (props.editingArticle) {
      const a = props.editingArticle
      title.value = a.title || ''
      abstract.value = a.abstract || ''
      content.value = a.content || ''
      authors.value = Array.isArray(a.authors) ? a.authors.join(', ') : ''
      keywords.value = Array.isArray(a.keywords) ? a.keywords.join(', ') : ''
      category.value = a.category || ''
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// Envio do formulário
function handleSubmit() {
  const articleData = {
    title: title.value.trim(),
    abstract: abstract.value.trim(),
    content: content.value.trim(),
    authors: authors.value.split(',').map(a => a.trim()),
    keywords: keywords.value.split(',').map(k => k.trim()),
    category: category.value,
  }

  // Se for edição, preserva o id
  if (props.editingArticle?.id) {
    articleData.id = props.editingArticle.id
  }

  props.onSave(articleData)
  toast.success(
    props.editingArticle
      ? 'Artigo atualizado com sucesso!'
      : 'Artigo publicado com sucesso!'
  )
  props.onOpenChange(false)
  resetForm()
}
</script>
