<script setup lang="ts">
const route = useRoute()
const home = computed(() => route.path === '/')
</script>

<template>
  <div :class="home ? 'flex h-dvh flex-col overflow-hidden bg-paper text-ink' : 'flex min-h-dvh flex-col bg-paper text-ink'">
    <a href="#content" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-paper focus:px-2 focus:underline">
      Skip to content
    </a>
    <SiteHeader />
    <main id="content" :class="home ? 'flex min-h-0 flex-1 flex-col overflow-hidden' : 'flex-1'">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
