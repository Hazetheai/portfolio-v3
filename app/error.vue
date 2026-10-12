<script setup lang="ts">
useSeoMeta({
  title: 'Page not found',
  robots: 'noindex',
})
</script>

<template>
  <NuxtLayout>
  <article class="mx-auto max-w-3xl px-5 py-16 sm:px-8">
    <h1 class="text-4xl font-semibold">Page not found</h1>
    <p class="mt-6">
      <NuxtLink class="underline" to="/">Back to the homepage</NuxtLink>
    </p>
  </article>
  </NuxtLayout>
</template>
