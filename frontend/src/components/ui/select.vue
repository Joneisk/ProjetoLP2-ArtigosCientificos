<!-- src/components/ui/Select.vue -->
<template>
  <slot />
</template>

<!-- ============================ -->
<!-- BLOCO PRINCIPAL DO SELECT    -->
<!-- ============================ -->
<script setup>
import { Root as SelectRoot } from 'radix-vue'

const attrs = useAttrs()
</script>

<!-- ============================ -->
<!-- SUBCOMPONENTES EXPORTADOS    -->
<!-- ============================ -->
<script>
import { h } from 'vue'
import {
  Group as SelectGroupRoot,
  Value as SelectValueRoot,
  Trigger as SelectTriggerRoot,
  Content as SelectContentRoot,
  Label as SelectLabelRoot,
  Item as SelectItemRoot,
  Separator as SelectSeparatorRoot,
  ScrollUpButton as SelectScrollUpButtonRoot,
  ScrollDownButton as SelectScrollDownButtonRoot,
  Portal,
  Viewport,
  ItemText,
  ItemIndicator,
  Icon,
} from 'radix-vue'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'
import { cn } from './utils'

// Raiz do Select
export const Select = SelectRoot

// Grupo
export const SelectGroup = (props, { slots }) =>
  h(SelectGroupRoot, { 'data-slot': 'select-group', ...props }, slots)

// Valor selecionado
export const SelectValue = (props, { slots }) =>
  h(SelectValueRoot, { 'data-slot': 'select-value', ...props }, slots)

// Botão de disparo
export const SelectTrigger = (props, { slots }) =>
  h(
    SelectTriggerRoot,
    {
      'data-slot': 'select-trigger',
      'data-size': props.size ?? 'default',
      class: cn(
        "border-input flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 data-[size=default]:h-9 data-[size=sm]:h-8 disabled:cursor-not-allowed disabled:opacity-50",
        props.className
      ),
      ...props,
    },
    {
      default: () => [
        slots.default?.(),
        h(Icon, null, () => h(ChevronDownIcon, { class: 'size-4 opacity-50' })),
      ],
    }
  )

// Conteúdo do dropdown
export const SelectContent = (props, { slots }) =>
  h(
    Portal,
    null,
    h(
      SelectContentRoot,
      {
        'data-slot': 'select-content',
        class: cn(
          "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out",
          props.position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          props.className
        ),
        position: props.position ?? 'popper',
        ...props,
      },
      {
        default: () => [
          h(SelectScrollUpButton),
          h(
            Viewport,
            {
              class: cn(
                'p-1',
                props.position === 'popper' &&
                  'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'
              ),
            },
            slots.default?.()
          ),
          h(SelectScrollDownButton),
        ],
      }
    )
  )

// Label
export const SelectLabel = (props, { slots }) =>
  h(
    SelectLabelRoot,
    {
      'data-slot': 'select-label',
      class: cn('text-muted-foreground px-2 py-1.5 text-xs', props.className),
      ...props,
    },
    slots
  )

// Item da lista
export const SelectItem = (props, { slots }) =>
  h(
    SelectItemRoot,
    {
      'data-slot': 'select-item',
      class: cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        props.className
      ),
      ...props,
    },
    {
      default: () => [
        h('span', { class: 'absolute right-2 flex items-center justify-center' }, [
          h(ItemIndicator, null, () => h(CheckIcon, { class: 'size-4' })),
        ]),
        h(ItemText, null, slots.default?.()),
      ],
    }
  )

// Separador
export const SelectSeparator = (props) =>
  h(
    SelectSeparatorRoot,
    {
      'data-slot': 'select-separator',
      class: cn('bg-border pointer-events-none -mx-1 my-1 h-px', props.className),
      ...props,
    }
  )

// Scroll Up
export const SelectScrollUpButton = (props) =>
  h(
    SelectScrollUpButtonRoot,
    {
      'data-slot': 'select-scroll-up-button',
      class: cn('flex cursor-default items-center justify-center py-1', props.className),
      ...props,
    },
    () => h(ChevronUpIcon, { class: 'size-4' })
  )

// Scroll Down
export const SelectScrollDownButton = (props) =>
  h(
    SelectScrollDownButtonRoot,
    {
      'data-slot': 'select-scroll-down-button',
      class: cn('flex cursor-default items-center justify-center py-1', props.className),
      ...props,
    },
    () => h(ChevronDownIcon, { class: 'size-4' })
  )
</script>
