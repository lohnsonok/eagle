<template>
  <ul
    :class="
      cn(
        'space-y-sm rounded-lg border border-rule bg-surface p-2 md:border-0 md:bg-transparent md:p-0',
        props.class
      )
    "
  >
    <li v-for="section in sections" :key="section.id">
      <a
        :href="`#${section.id}`"
        :class="
          cn(
            'block rounded-md border-l-4 px-3 py-2 text-small transition',
            section.id === activeId
              ? 'border-accent bg-accent-soft/60 font-medium text-ink md:bg-transparent'
              : 'border-transparent text-ink-muted hover:text-ink'
          )
        "
      >
        {{ section.title }}
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { LegalPageSection } from '~/data/legal'

interface Props {
  sections: LegalPageSection[]
  activeId: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>
