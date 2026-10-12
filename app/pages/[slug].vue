<script setup lang="ts">
import type { SiteContent } from '~~/shared/content'
import { siteConfig } from '~/site.config'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data: content } = await useFetch<SiteContent>('/api/content')
const page = computed(() => {
  const found = content.value?.pages.find((item) => item.slug === slug.value)
  if (!found || found.type === 'home') return undefined
  return found
})
const work = computed(() => content.value?.work ?? [])

if (slug.value === 'home') {
  await navigateTo('/', { redirectCode: 301 })
} else if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

usePageMeta({
  title: () => page.value ? `${page.value.name} — ${siteConfig.name}` : siteConfig.name,
  description: () => page.value?.description || siteConfig.description,
  pageName: () => page.value?.name,
})
</script>

<template>
  <article v-if="page" class="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
    <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">{{ page.name }}</h1>
    <div v-if="page.html" class="prose mt-8 max-w-xl" v-html="page.html" />
    <ContactLinks v-if="page.type === 'contact'" />
    <div v-if="page.type === 'work'" class="mt-12">
      <WorkEntry v-for="entry in work" :key="entry.id" :entry="entry" />
    </div>
  </article>
</template>
