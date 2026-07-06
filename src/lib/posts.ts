import config from '@payload-config'
import { getPayload } from 'payload'

const publishedWhere = () => ({
  publishedAt: {
    exists: true,
    less_than_equal: new Date().toISOString(),
  },
})

export async function getPublishedPosts() {
  const payload = await getPayload({ config })

  return payload.find({
    collection: 'posts',
    where: publishedWhere(),
    sort: '-publishedAt',
    depth: 2,
  })
}

export async function getPublishedPostBySlug(slug: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, publishedWhere()],
    },
    limit: 1,
    depth: 2,
  })

  return result.docs[0] ?? null
}

export async function getPublishedPostSlugs() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: publishedWhere(),
    limit: 1000,
    depth: 0,
    select: {
      slug: true,
    },
  })

  return result.docs.map((post) => post.slug).filter(Boolean) as string[]
}
