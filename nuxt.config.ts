import { existsSync, readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import { siteConfig } from './app/site.config'
import type { SiteContent } from './shared/content'

const siteUrl = process.env.SITE_URL || 'http://localhost:3000'

function contentRoutes() {
  const file = new URL('./content/site.json', import.meta.url)
  if (!existsSync(file)) return ['/']
  const data = JSON.parse(readFileSync(file, 'utf8')) as SiteContent
  const routes = new Set<string>(['/'])
  for (const page of data.pages) {
    if (page.type !== 'home' && page.slug) routes.add(`/${page.slug}`)
  }
  return [...routes]
}

export default defineNuxtConfig({
  compatibilityDate: '2025-05-22',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['@nuxtjs/seo', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  site: {
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    indexable: siteUrl.startsWith('https://'),
  },
  ogImage: {
    enabled: false,
  },
  linkChecker: {
    enabled: false,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'preload',
          href: '/fonts/instrument-sans-latin-400-normal.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/instrument-sans-latin-600-normal.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/instrument-sans-latin-700-normal.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: contentRoutes(),
    },
  },
})
