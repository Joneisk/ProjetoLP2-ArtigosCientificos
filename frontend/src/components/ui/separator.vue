<!-- Separator.vue -->
<template>
  <SeparatorRoot
    data-slot="separator-root"
    :orientation="orientation"
    :decorative="decorative"
    :class="cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      className
    )"
    v-bind="attrs"
  />
</template>

<script setup>
import { useAttrs } from 'vue'
import { Root as SeparatorRoot } from 'radix-vue'
import { cn } from './utils'

const attrs = useAttrs()

const props = defineProps({
  className: { type: String, default: '' },
  orientation: { type: String, default: 'horizontal' },
  decorative: { type: Boolean, default: true },
})
</script>
