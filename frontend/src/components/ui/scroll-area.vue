<!-- src/components/ui/ScrollArea.vue -->
<template>
  <ScrollAreaRoot
    data-slot="scroll-area"
    :class="cn('relative', className)"
    v-bind="attrs"
  >
    <ScrollAreaViewport
      data-slot="scroll-area-viewport"
      class="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
    >
      <slot />
    </ScrollAreaViewport>

    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>

<!-- ============================ -->
<!-- BLOCO PRINCIPAL DO SCROLLAREA -->
<!-- ============================ -->
<script setup>
import {
  Root as ScrollAreaRoot,
  Viewport as ScrollAreaViewport,
  Corner as ScrollAreaCorner,
} from 'radix-vue'
import { cn } from './utils'

const attrs = useAttrs()

const props = defineProps({
  className: { type: String, default: '' },
})
</script>

<!-- ============================ -->
<!-- SUBCOMPONENTE EXPORTADO       -->
<!-- ============================ -->
<script>
import { h } from 'vue'
import { Scrollbar as ScrollbarRoot, Thumb as ScrollbarThumb } from 'radix-vue'

export const ScrollBar = (props) => {
  const orientation = props?.orientation || 'vertical'

  return h(
    ScrollbarRoot,
    {
      'data-slot': 'scroll-area-scrollbar',
      orientation,
      class: cn(
        'flex touch-none p-px select-none transition-colors',
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
        props?.className
      ),
      ...props,
    },
    {
      default: () =>
        h(ScrollbarThumb, {
          'data-slot': 'scroll-area-thumb',
          class: 'bg-border relative flex-1 rounded-full',
        }),
    }
  )
}
</script>
