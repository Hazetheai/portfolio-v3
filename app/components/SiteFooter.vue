<script setup lang="ts">
import { siteConfig } from '~/site.config'

const { github, linkedin, cv, location, legal } = siteConfig
</script>

<template>
  <footer class="border-t border-rule">
    <div class="mx-auto flex max-w-3xl flex-wrap gap-x-5 gap-y-2 px-5 py-8 font-sans text-sm text-muted sm:px-8">
      <span>{{ location }}</span>
      <CopyEmail label="Email" />
      <NuxtLink class="underline" to="/contact">Contact</NuxtLink>
      <a class="underline" :href="github" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a class="underline" :href="linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a class="underline" :href="cv" download>CV</a>
      <NuxtLink
        v-for="item in legal"
        :key="item.to"
        class="underline"
        :to="item.to"
      >{{ item.label }}</NuxtLink>
    </div>
  </footer>
</template>
