<!-- src/components/ui/dialog.vue -->
<template>
  <DialogRoot data-slot="dialog" v-bind="attrs">
    <slot />
  </DialogRoot>
</template>

<script setup>
import {
  Root as DialogRoot,
  Trigger as DialogTriggerRoot,
  Portal as DialogPortalRoot,
  Overlay as DialogOverlayRoot,
  Content as DialogContentRoot,
  Close as DialogCloseRoot,
  Title as DialogTitleRoot,
  Description as DialogDescriptionRoot,
} from 'radix-vue'
import { XIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const attrs = useAttrs()

// Subcomponentes locais
const DialogTrigger = (props, { slots }) =>
  h(DialogTriggerRoot, { 'data-slot': 'dialog-trigger', ...props }, slots)

const DialogPortal = (props, { slots }) =>
  h(DialogPortalRoot, { 'data-slot': 'dialog-portal', ...props }, slots)

const DialogClose = (props, { slots }) =>
  h(DialogCloseRoot, { 'data-slot': 'dialog-close', ...props }, slots)

const DialogOverlay = (props) =>
  h(DialogOverlayRoot, {
    'data-slot': 'dialog-overlay',
    class: cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
      props.className
    ),
    ...props,
  })

const DialogContent = (props, { slots }) =>
  h(
    DialogPortal,
    null,
    {
      default: () => [
        h(DialogOverlay),
        h(
          DialogContentRoot,
          {
            'data-slot': 'dialog-content',
            class: cn(
              'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg duration-200',
              props.className
            ),
            ...props,
          },
          {
            default: () => [
              slots.default?.(),
              h(
                DialogCloseRoot,
                {
                  class:
                    'absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none',
                },
                {
                  default: () => [
                    h(XIcon, { class: 'size-4' }),
                    h('span', { class: 'sr-only' }, 'Fechar'),
                  ],
                }
              ),
            ],
          }
        ),
      ],
    }
  )

const DialogHeader = (props, { slots }) =>
  h(
    'div',
    {
      'data-slot': 'dialog-header',
      class: cn('flex flex-col gap-2 text-center sm:text-left', props.className),
      ...props,
    },
    slots
  )

const DialogFooter = (props, { slots }) =>
  h(
    'div',
    {
      'data-slot': 'dialog-footer',
      class: cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', props.className),
      ...props,
    },
    slots
  )

const DialogTitle = (props, { slots }) =>
  h(
    DialogTitleRoot,
    {
      'data-slot': 'dialog-title',
      class: cn('text-lg font-semibold leading-none', props.className),
      ...props,
    },
    slots
  )

const DialogDescription = (props, { slots }) =>
  h(
    DialogDescriptionRoot,
    {
      'data-slot': 'dialog-description',
      class: cn('text-muted-foreground text-sm', props.className),
      ...props,
    },
    slots
  )
</script>
