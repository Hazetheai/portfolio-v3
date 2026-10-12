import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { Client } from '@notionhq/client'
import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type { PageType, SiteContent, SitePage, WorkEntry, WorkImage } from '../shared/content'

loadEnv(resolve(process.cwd(), '.env'))

const required = ['NOTION_API_KEY', 'NOTION_DB_PAGES', 'NOTION_DB_WORK'] as const
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key}. Copy .env.example to .env and fill it in.`)
  }
}

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const mediaDir = resolve(process.cwd(), 'public/media')
const contentFile = resolve(process.cwd(), 'content/site.json')

const content = await fetchContent()
mkdirSync(resolve(process.cwd(), 'content'), { recursive: true })
writeFileSync(contentFile, `${JSON.stringify(content, null, 2)}\n`)
console.log(`Wrote ${content.pages.length} pages and ${content.work.length} work entries.`)

async function fetchContent(): Promise<SiteContent> {
  const [pageRows, workRows] = await Promise.all([
    queryDatabase(process.env.NOTION_DB_PAGES!),
    queryDatabase(process.env.NOTION_DB_WORK!),
  ])

  const pages = await Promise.all(pageRows.map(toPage))
  const work = (await Promise.all(workRows.map(toWork))).sort((a, b) => a.order - b.order)

  return { pages, work }
}

async function queryDatabase(databaseId: string) {
  const rows: PageObjectResponse[] = []
  let cursor: string | undefined
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      filter: { property: 'Published', checkbox: { equals: true } },
    })
    for (const row of response.results) {
      if (row.object === 'page' && 'properties' in row) rows.push(row)
    }
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)
  return rows
}

async function toPage(page: PageObjectResponse): Promise<SitePage> {
  const blocks = await listBlocks(page.id)
  return {
    id: page.id,
    name: title(page, 'Name'),
    slug: richText(page, 'Slug'),
    type: select(page, 'Type') as PageType,
    description: richText(page, 'Description'),
    html: blocksToHtml(blocks),
  }
}

async function toWork(page: PageObjectResponse): Promise<WorkEntry> {
  const slug = richText(page, 'Slug') || page.id
  const name = title(page, 'Name')
  const blocks = await listBlocks(page.id)
  return {
    id: page.id,
    name,
    slug,
    order: numberValue(page, 'Order') ?? 0,
    year: numberValue(page, 'Year'),
    url: urlValue(page, 'URL'),
    context: select(page, 'Context'),
    organization: richText(page, 'Organization') || null,
    roles: multiSelect(page, 'Roles'),
    summary: richText(page, 'Summary'),
    contribution: richText(page, 'Contribution'),
    stack: richText(page, 'Stack') || null,
    html: blocksToHtml(blocks),
    images: await downloadImages(page, slug, name),
  }
}

async function downloadImages(page: PageObjectResponse, slug: string, name: string): Promise<WorkImage[]> {
  const property = page.properties.Images
  if (!property || property.type !== 'files') return []
  mkdirSync(mediaDir, { recursive: true })
  const images: WorkImage[] = []

  for (const [index, file] of property.files.entries()) {
    const source = fileUrl(file)
    if (!source) continue
    const ext = extension(source, file.name)
    const filename = `${slug}-${index + 1}${ext}`
    const dest = resolve(mediaDir, filename)
    const response = await fetch(source)
    if (!response.ok) {
      console.warn(`Skipped image for ${name}: ${response.status}`)
      continue
    }
    writeFileSync(dest, Buffer.from(await response.arrayBuffer()))
    images.push({
      src: `/media/${filename}`,
      alt: property.files.length > 1 ? `${name}, image ${index + 1}` : name,
    })
  }

  return images
}

function fileUrl(file: { type: string, name: string, file?: { url: string }, external?: { url: string } }) {
  if (file.type === 'file') return file.file?.url || null
  if (file.type === 'external') return file.external?.url || null
  return null
}

function extension(url: string, name: string) {
  const fromName = extname(name.split('?')[0] || '')
  if (fromName) return fromName.toLowerCase()
  const fromUrl = extname(new URL(url).pathname)
  return fromUrl || '.jpg'
}

async function listBlocks(blockId: string) {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined
  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    })
    for (const block of response.results) {
      if ('type' in block) blocks.push(block)
    }
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)
  return blocks
}

function blocksToHtml(blocks: BlockObjectResponse[]) {
  const html: string[] = []
  let index = 0
  while (index < blocks.length) {
    const block = blocks[index]
    if (!block) break
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const type = block.type
      const tag = type === 'bulleted_list_item' ? 'ul' : 'ol'
      const items: string[] = []
      while (index < blocks.length && blocks[index]?.type === type) {
        const item = blocks[index]
        if (item) items.push(`<li>${richTextHtml(itemRichText(item))}</li>`)
        index += 1
      }
      html.push(`<${tag}>${items.join('')}</${tag}>`)
      continue
    }
    const piece = blockToHtml(block)
    if (piece) html.push(piece)
    index += 1
  }
  return html.join('\n')
}

function blockToHtml(block: BlockObjectResponse) {
  switch (block.type) {
    case 'paragraph':
      return wrap('p', richTextHtml(block.paragraph.rich_text))
    case 'heading_1':
    case 'heading_2':
      return wrap('h2', richTextHtml(block.type === 'heading_1' ? block.heading_1.rich_text : block.heading_2.rich_text))
    case 'heading_3':
      return wrap('h3', richTextHtml(block.heading_3.rich_text))
    case 'quote':
      return wrap('blockquote', richTextHtml(block.quote.rich_text))
    case 'divider':
      return '<hr>'
    default:
      return ''
  }
}

function wrap(tag: string, inner: string) {
  if (!inner) return ''
  return `<${tag}>${inner}</${tag}>`
}

function itemRichText(block: BlockObjectResponse): RichTextItemResponse[] {
  if (block.type === 'bulleted_list_item') return block.bulleted_list_item.rich_text
  if (block.type === 'numbered_list_item') return block.numbered_list_item.rich_text
  return []
}

function richTextHtml(items: RichTextItemResponse[]) {
  return items.map((item) => {
    let text = escapeHtml(item.plain_text)
    if (item.annotations.code) text = `<code>${text}</code>`
    if (item.annotations.bold) text = `<strong>${text}</strong>`
    if (item.annotations.italic) text = `<em>${text}</em>`
    if (item.annotations.strikethrough) text = `<s>${text}</s>`
    const href = safeUrl(item.href)
    if (href) text = `<a href="${escapeAttr(href)}">${text}</a>`
    return text
  }).join('')
}

function safeUrl(value: string | null) {
  if (!value) return null
  try {
    const parsed = new URL(value, 'https://example.com')
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return value
    }
  } catch {
    return null
  }
  return null
}

function title(page: PageObjectResponse, name: string) {
  const property = page.properties[name]
  if (property?.type === 'title') return plain(property.title)
  return ''
}

function richText(page: PageObjectResponse, name: string) {
  const property = page.properties[name]
  if (property?.type === 'rich_text') return plain(property.rich_text)
  return ''
}

function select(page: PageObjectResponse, name: string) {
  const property = page.properties[name]
  if (property?.type === 'select') return property.select?.name || null
  return null
}

function multiSelect(page: PageObjectResponse, name: string) {
  const property = page.properties[name]
  if (property?.type === 'multi_select') return property.multi_select.map((item) => item.name)
  return []
}

function numberValue(page: PageObjectResponse, name: string) {
  const property = page.properties[name]
  if (property?.type === 'number') return property.number
  return null
}

function urlValue(page: PageObjectResponse, name: string) {
  const property = page.properties[name]
  if (property?.type === 'url') return property.url
  return null
}

function plain(items: RichTextItemResponse[]) {
  return items.map((item) => item.plain_text).join('').trim()
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeAttr(value: string) {
  return escapeHtml(value).replaceAll('"', '&quot;')
}

function loadEnv(file: string) {
  let source = ''
  try {
    source = readFileSync(file, 'utf8')
  } catch {
    return
  }
  for (const line of source.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index === -1) continue
    const key = trimmed.slice(0, index)
    const value = trimmed.slice(index + 1).replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}
