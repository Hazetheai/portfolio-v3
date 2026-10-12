<script setup lang="ts">
import { siteConfig } from '~/site.config'

const { github, linkedin, cv } = siteConfig
</script>

<template>
  <ul class="mt-10 space-y-2 font-sans text-sm">
    <li>
      <CopyEmail />
    </li>
    <li>
      <a class="underline" :href="github" target="_blank" rel="noopener noreferrer">GitHub</a>
    </li>
    <li>
      <a class="underline" :href="linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </li>
    <li>
      <a class="underline" :href="cv" download>Download CV</a>
    </li>
  </ul>
</template>
