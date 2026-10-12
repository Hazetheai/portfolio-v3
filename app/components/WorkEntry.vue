<script setup lang="ts">
import type { WorkEntry } from '~~/shared/content'
import { workHost } from '~~/shared/content'

defineProps<{
  entry: WorkEntry
}>()
</script>

<template>
  <article :id="entry.slug" class="scroll-mt-8 border-t border-rule py-12">
    <h2 class="text-3xl font-semibold leading-tight">{{ entry.name }}</h2>
    <p class="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm">
      <span v-if="entry.year" class="text-muted">{{ entry.year }}</span>
      <span v-if="entry.context" class="mark">{{ entry.context }}</span>
      <span v-if="entry.organization" class="text-muted">{{ entry.organization }}</span>
      <span v-for="role in entry.roles" :key="role" class="mark mark-role">{{ role }}</span>
    </p>
    <div v-if="entry.html" class="prose mt-6 max-w-xl" v-html="entry.html" />
    <p v-if="entry.stack" class="mt-4 text-sm text-muted">{{ entry.stack }}</p>
    <p v-if="entry.url" class="mt-4 text-sm">
      <a class="underline" :href="entry.url" target="_blank" rel="noopener noreferrer">{{ workHost(entry.url) }}</a>
    </p>
    <div v-if="entry.images.length" class="mt-8 space-y-4">
      <img
        v-for="image in entry.images"
        :key="image.src"
        :src="image.src"
        :alt="image.alt"
        class="block h-auto w-full"
        decoding="async"
      >
    </div>
  </article>
</template>
