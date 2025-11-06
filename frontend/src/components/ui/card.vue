<!-- src/components/ui/Card.vue -->
<template>
  <div
    data-slot="card"
    :class="cn(
      'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
      className
    )"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>

<!-- ============================ -->
<!--  BLOCO PRINCIPAL DO CARD     -->
<!-- ============================ -->
<script setup>
import { cn } from './utils'

const props = defineProps({
  className: { type: String, default: '' },
})
const attrs = useAttrs()
</script>

<!-- ============================ -->
<!--  SUBCOMPONENTES EXPORTADOS   -->
<!-- ============================ -->
<script>

// Cabeçalho
export const CardHeader = (props, { slots }) =>
  h(
    'div',
    {
      'data-slot': 'card-header',
      class: cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        props.className
      ),
      ...useAttrs(),
    },
    slots
  )

// Título
export const CardTitle = (props, { slots }) =>
  h(
    'h4',
    {
      'data-slot': 'card-title',
      class: cn('leading-none font-semibold text-lg', props.className),
      ...useAttrs(),
    },
    slots
  )

// Descrição
export const CardDescription = (props, { slots }) =>
  h(
    'p',
    {
      'data-slot': 'card-description',
      class: cn('text-muted-foreground text-sm', props.className),
      ...useAttrs(),
    },
    slots
  )

// Ações (ícones, botões)
export const CardAction = (props, { slots }) =>
  h(
    'div',
    {
      'data-slot': 'card-action',
      class: cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        props.className
      ),
      ...useAttrs(),
    },
    slots
  )

// Conteúdo
export const CardContent = (props, { slots }) =>
  h(
    'div',
    {
      'data-slot': 'card-content',
      class: cn('px-6 [&:last-child]:pb-6', props.className),
      ...useAttrs(),
    },
    slots
  )

// Rodapé
export const CardFooter = (props, { slots }) =>
  h(
    'div',
    {
      'data-slot': 'card-footer',
      class: cn('flex items-center px-6 pb-6 [.border-t]:pt-6', props.className),
      ...useAttrs(),
    },
    slots
  )
</script>
