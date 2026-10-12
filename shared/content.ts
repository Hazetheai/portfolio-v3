export type PageType = 'home' | 'about' | 'work' | 'contact' | 'legal'

export interface SitePage {
  id: string
  name: string
  slug: string
  type: PageType
  description: string
  html: string
}

export interface WorkImage {
  src: string
  alt: string
}

export interface WorkEntry {
  id: string
  name: string
  slug: string
  order: number
  year: number | null
  url: string | null
  context: string | null
  organization: string | null
  roles: string[]
  summary: string
  contribution: string
  stack: string | null
  html: string
  images: WorkImage[]
}

export interface SiteContent {
  pages: SitePage[]
  work: WorkEntry[]
}

export function workMeta(entry: WorkEntry) {
  const roles = entry.roles.join(', ')
  return [entry.year, entry.context, entry.organization, roles]
    .filter((part) => part !== null && part !== undefined && String(part).length > 0)
    .join(' · ')
}

export function workHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}
