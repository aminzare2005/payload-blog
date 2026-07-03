import 'dotenv/config'

import { convertHTMLToLexical } from '@payloadcms/richtext-lexical'
import { editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'

import config from '../src/payload.config.ts'
import { paragraphsToLexical } from '../src/lib/lexical.ts'

const ZOOMIT_FEED_URL = 'https://www.zoomit.ir/feed/'
const POST_COUNT = 10
const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; landing-base-seed/1.0)',
  Accept: 'text/html,application/xml,image/*;q=0.9,*/*;q=0.8',
  Referer: 'https://www.zoomit.ir/',
}

type FeedItem = {
  title: string
  link: string
  pubDate: string
  excerpt: string
  imageUrl: string | null
}

function extractSlugFromUrl(url: string) {
  const pathname = new URL(url).pathname
  const segments = pathname.split('/').filter(Boolean)
  return segments[segments.length - 1] ?? pathname.replace(/\//g, '-')
}

function parseFeedItems(xml: string): FeedItem[] {
  const dom = new JSDOM(xml, { contentType: 'text/xml' })
  const items = [...dom.window.document.querySelectorAll('item')]

  return items.map((item) => {
    const title = item.querySelector('title')?.textContent?.trim() ?? ''
    const link = item.querySelector('link')?.textContent?.trim() ?? ''
    const pubDate = item.querySelector('pubDate')?.textContent?.trim() ?? ''
    const descriptionHtml = item.querySelector('description')?.textContent ?? ''

    const descriptionDom = new JSDOM(descriptionHtml)
    const imageUrl = descriptionDom.window.document.querySelector('img')?.getAttribute('src') ?? null
    const excerpt =
      descriptionDom.window.document.querySelector('p')?.textContent?.trim() ??
      descriptionDom.window.document.body.textContent?.trim() ??
      ''

    return { title, link, pubDate, excerpt, imageUrl }
  })
}

async function fetchArticleParagraphs(url: string, fallbackExcerpt: string) {
  try {
    const response = await fetch(url, { headers: FETCH_HEADERS })
    if (!response.ok) {
      return [fallbackExcerpt]
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    const paragraphSelectors = [
      'article p',
      '[class*="article"] p',
      'main p',
    ]

    const paragraphs = new Set<string>()

    for (const selector of paragraphSelectors) {
      for (const node of document.querySelectorAll(selector)) {
        const text = node.textContent?.replace(/\s+/g, ' ').trim()
        if (!text || text.length < 40) continue
        if (/تبلیغات|مشاهده همه|لایک|نظر|بوکمارک|اشتراک/.test(text)) continue
        paragraphs.add(text)
      }

      if (paragraphs.size >= 4) break
    }

    if (paragraphs.size === 0) {
      const ogDescription = document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content')
        ?.trim()

      if (ogDescription) {
        paragraphs.add(ogDescription)
      }
    }

    if (paragraphs.size === 0 && fallbackExcerpt) {
      paragraphs.add(fallbackExcerpt)
    }

    return [...paragraphs].slice(0, 8)
  } catch {
    return [fallbackExcerpt]
  }
}

async function downloadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  imageUrl: string,
  alt: string,
) {
  const response = await fetch(imageUrl, { headers: FETCH_HEADERS })
  if (!response.ok) {
    throw new Error(`Failed to download image: ${imageUrl}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') ?? 'image/jpeg'
  const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'

  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: contentType,
      name: `${extractSlugFromUrl(imageUrl)}.${extension}`,
      size: buffer.length,
    },
    overrideAccess: true,
  })
}

async function clearExistingPosts(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = await payload.find({
    collection: 'posts',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  for (const post of existing.docs) {
    await payload.delete({
      collection: 'posts',
      id: post.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  const media = await payload.find({
    collection: 'media',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  for (const item of media.docs) {
    await payload.delete({
      collection: 'media',
      id: item.id,
      overrideAccess: true,
    })
  }
}

async function seedPosts() {
  console.log('Fetching Zoomit RSS feed...')
  const feedResponse = await fetch(ZOOMIT_FEED_URL, { headers: FETCH_HEADERS })

  if (!feedResponse.ok) {
    throw new Error(`Failed to fetch Zoomit feed (${feedResponse.status})`)
  }

  const feedXml = await feedResponse.text()
  const feedItems = parseFeedItems(feedXml).slice(0, POST_COUNT)

  if (feedItems.length === 0) {
    throw new Error('No feed items found from Zoomit')
  }

  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })

  console.log('Clearing existing posts and media...')
  await clearExistingPosts(payload)

  for (const [index, item] of feedItems.entries()) {
    console.log(`Seeding ${index + 1}/${feedItems.length}: ${item.title}`)

    let coverImageId: string | undefined

    if (item.imageUrl) {
      try {
        const media = await downloadMedia(payload, item.imageUrl, item.title)
        coverImageId = String(media.id)
      } catch (error) {
        console.warn(`  Skipped cover image: ${error instanceof Error ? error.message : error}`)
      }
    }

    const paragraphs = await fetchArticleParagraphs(item.link, item.excerpt)
    const html = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')
    const content = convertHTMLToLexical({
      editorConfig,
      html,
      JSDOM,
    })

    const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()

    await payload.create({
      collection: 'posts',
      data: {
        title: item.title,
        slug: extractSlugFromUrl(item.link),
        excerpt: item.excerpt,
        content: content ?? paragraphsToLexical(paragraphs),
        coverImage: coverImageId,
        publishedAt,
        generateSlug: false,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  console.log(`Done. Seeded ${feedItems.length} posts from Zoomit.`)
  process.exit(0)
}

seedPosts().catch((error) => {
  console.error(error)
  process.exit(1)
})
