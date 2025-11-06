<!-- src/components/ui/dropdown-menu.vue -->
<template>
  <DropdownMenuRoot data-slot="dropdown-menu" v-bind="attrs">
    <slot />
  </DropdownMenuRoot>
</template>

<script setup>
import { Root as DropdownMenuRoot, Content as DropdownMenuContentRoot, Item as DropdownMenuItemRoot } from 'radix-vue'
import { CheckIcon, ChevronRightIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const attrs = useAttrs()

const DropdownMenuTrigger = (props, { slots }) =>
  h(DropdownMenuTriggerRoot, { 'data-slot': 'dropdown-trigger', ...props }, slots)

const DropdownMenuPortal = (props, { slots }) =>
  h(DropdownMenuPortalRoot, { 'data-slot': 'dropdown-portal', ...props }, slots)

const DropdownMenuContent = (props, { slots }) =>
  h(
    DropdownMenuPortal,
    null,
    {
      default: () =>
        h(
          DropdownMenuContentRoot,
          {
            'data-slot': 'dropdown-content',
            sideOffset: props.sideOffset ?? 4,
            class: cn(
              'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80',
              props.className
            ),
            ...props,
          },
          slots
        ),
    }
  )

const DropdownMenuItem = (props, { slots }) =>
  h(
    DropdownMenuItemRoot,
    {
      'data-slot': 'dropdown-item',
      class: cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
        props.className
      ),
      ...props,
    },
    slots
  )

const DropdownMenuLabel = (props, { slots }) =>
  h(
    DropdownMenuLabelRoot,
    {
      'data-slot': 'dropdown-label',
      class: cn('px-2 py-1.5 text-sm font-medium text-muted-foreground', props.className),
      ...props,
    },
    slots
  )

const DropdownMenuSeparator = (props) =>
  h(DropdownMenuSeparatorRoot, {
    'data-slot': 'dropdown-separator',
    class: cn('-mx-1 my-1 h-px bg-border', props.className),
    ...props,
  })
</script>
