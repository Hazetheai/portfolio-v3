<script setup lang="ts">
import { siteConfig } from '~/site.config'

const route = useRoute()
const { nav, name } = siteConfig

function current(to: string) {
  return route.path === to
}
</script>

<template>
  <header class="border-b border-rule">
    <div class="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-5 py-5 sm:px-8">
      <NuxtLink to="/" class="font-sans text-3xl font-semibold leading-none tracking-tight sm:text-4xl" :aria-label="name">JR</NuxtLink>
      <nav aria-label="Pages">
        <ul class="flex flex-wrap gap-x-5 font-sans text-sm">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="underline"
              :aria-current="current(item.to) ? 'page' : undefined"
            >{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
