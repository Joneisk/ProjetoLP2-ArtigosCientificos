<!-- LoginDialog.vue -->
<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Entrar no SciHub Research</DialogTitle>
        <DialogDescription>
          Entre com suas credenciais para acessar todos os recursos
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email -->
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            v-model="email"
            required
          />
        </div>

        <!-- Senha -->
        <div class="space-y-2">
          <Label for="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            v-model="password"
            required
          />
        </div>

        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuth } from '@/contexts/AuthContext'

// Importa os componentes de UI usados nos outros diálogos
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
const props = defineProps({
  open: { type: Boolean, required: true },
  onOpenChange: { type: Function, required: true },
})

// Estados
const email = ref('')
const password = ref('')
const loading = ref(false)

// Contexto de autenticação
const { login } = useAuth()

// Envio do formulário
async function handleSubmit() {
  loading.value = true
  try {
    const success = await login(email.value, password.value)
    if (success) {
      toast.success('Login realizado com sucesso!')
      props.onOpenChange(false)
      email.value = ''
      password.value = ''
    } else {
      toast.error('Credenciais inválidas')
    }
  } catch (err) {
    toast.error('Erro ao fazer login')
  } finally {
    loading.value = false
  }
}
</script>
