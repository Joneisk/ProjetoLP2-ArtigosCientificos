<!-- src/components/RegisterDialog.vue -->
<template>
  <Dialog :open="props.open" @update:open="props.onOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Registrar no SciHub Research</DialogTitle>
        <DialogDescription>
          Crie sua conta para publicar e interagir com artigos científicos.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nome -->
        <div class="space-y-2">
          <Label for="name">Nome Completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Dr. João Silva"
            v-model="name"
            required
          />
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <Label for="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="seu@email.com"
            v-model="email"
            required
          />
        </div>

        <!-- Senha -->
        <div class="space-y-2">
          <Label for="register-password">Senha</Label>
          <Input
            id="register-password"
            type="password"
            placeholder="********"
            v-model="password"
            required
          />
        </div>

        <!-- Instituição -->
        <div class="space-y-2">
          <Label for="institution">Instituição (Opcional)</Label>
          <Input
            id="institution"
            type="text"
            placeholder="Universidade Federal"
            v-model="institution"
          />
        </div>

        <!-- Botão -->
        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrar' }}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuth } from '@/contexts/AuthContext'

// Componentes UI (garanta que o nome do arquivo é idêntico ao import)
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

// Props
const props = defineProps<{
  open: boolean
  onOpenChange: (value: boolean) => void
}>()

// Estado
const name = ref('')
const email = ref('')
const password = ref('')
const institution = ref('')
const loading = ref(false)

// Contexto de autenticação
const { register } = useAuth()

// Envio do formulário
async function handleSubmit() {
  loading.value = true
  try {
    const success = await register(
      name.value,
      email.value,
      password.value,
      institution.value
    )
    if (success) {
      toast.success('Registro realizado com sucesso!')
      props.onOpenChange(false)
      name.value = ''
      email.value = ''
      password.value = ''
      institution.value = ''
    } else {
      toast.error('Erro ao registrar')
    }
  } catch (err) {
    toast.error('Erro ao fazer registro')
  } finally {
    loading.value = false
  }
}
</script>
