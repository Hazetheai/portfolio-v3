<script setup lang="ts">
import type { SiteContent } from '~~/shared/content'
import { siteConfig } from '~/site.config'

const { data: content } = await useFetch<SiteContent>('/api/content')
const home = computed(() => content.value?.pages.find((page) => page.type === 'home'))

if (!home.value) {
  throw createError({ statusCode: 404, statusMessage: 'Home page is missing' })
}

useSeoMeta({
  title: siteConfig.name,
  description: home.value.description || siteConfig.description,
})
useHead({
  titleTemplate: '%s',
})
</script>

<template>
  <article class="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col px-5 pt-16 sm:px-8 sm:pt-24">
    <h1 class="sr-only">{{ siteConfig.name }}</h1>
    <div v-if="home" class="max-w-2xl text-2xl leading-snug sm:text-3xl [&_p]:m-0" v-html="home.html" />
    <p class="mt-12">
      <NuxtLink class="underline" to="/work">Work</NuxtLink>
    </p>
  </article>
</template>
