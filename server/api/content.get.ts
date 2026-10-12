import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { SiteContent } from '../../shared/content'

export default defineEventHandler((): SiteContent => {
  const file = resolve(process.cwd(), 'content/site.json')
  return JSON.parse(readFileSync(file, 'utf8')) as SiteContent
})
