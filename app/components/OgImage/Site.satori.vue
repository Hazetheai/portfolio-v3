<script setup lang="ts">
import { siteConfig } from '~/site.config'

defineProps<{
  title: string
  description?: string
  pageName?: string
}>()
</script>

<template>
  <div
    style="display: flex; flex-direction: column; justify-content: space-between; width: 100%; height: 100%; background: #fff; color: #1a1a1a; padding: 72px 80px; font-family: 'Instrument Sans';"
  >
    <div style="display: flex; flex-direction: column;">
      <div style="font-size: 92px; font-weight: 700; letter-spacing: -2px; line-height: 1;">JR</div>
      <div
        v-if="pageName"
        style="margin-top: 32px; font-size: 38px; font-weight: 400; letter-spacing: 0.4px; line-height: 1.15;"
      >
        {{ pageName }}
      </div>
      <div
        v-if="description && pageName"
        style="margin-top: 14px; max-width: 980px; color: #5c5c5c; font-size: 32px; font-weight: 400; line-height: 1.35;"
      >
        {{ description }}
      </div>
      <div
        v-if="description && !pageName"
        style="margin-top: 36px; max-width: 980px; font-size: 32px; font-weight: 400; line-height: 1.35;"
      >
        {{ description }}
      </div>
    </div>
    <div style="display: flex; flex-direction: column;">
      <div style="width: 100%; height: 1px; background: #e4e4e4;" />
      <div style="display: flex; justify-content: space-between; margin-top: 24px; font-size: 24px; line-height: 1;">
        <span>{{ siteConfig.name }}</span>
        <span>{{ siteConfig.location }}</span>
      </div>
    </div>
  </div>
</template>
