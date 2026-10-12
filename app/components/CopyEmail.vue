<script setup lang="ts">
import { siteConfig } from '~/site.config'

withDefaults(defineProps<{
  label?: string
}>(), {
  label: 'Copy email',
})

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(siteConfig.email)
  } catch {
    const field = document.createElement('textarea')
    field.value = siteConfig.email
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.left = '-9999px'
    document.body.appendChild(field)
    field.select()
    document.execCommand('copy')
    field.remove()
  }
  copied.value = true
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <button
    type="button"
    class="border-0 bg-transparent p-0 underline"
    :aria-live="copied ? 'polite' : 'off'"
    @click="copy"
  >
    {{ copied ? 'Copied' : label }}
  </button>
</template>
