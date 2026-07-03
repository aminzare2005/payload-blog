import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { Post } from '@/payload-types'

const isPublished = (post: Post) => {
  if (!post.publishedAt) return false
  return new Date(post.publishedAt) <= new Date()
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  if (isPublished(doc)) {
    payload.logger.info(`Revalidating post at path: /${doc.slug}`)
    revalidatePath('/')
    revalidatePath(`/${doc.slug}`)
  }

  if (previousDoc?.slug && previousDoc.slug !== doc.slug && isPublished(previousDoc)) {
    payload.logger.info(`Revalidating old post at path: /${previousDoc.slug}`)
    revalidatePath(`/${previousDoc.slug}`)
    revalidatePath('/')
  }

  if (previousDoc && isPublished(previousDoc) && !isPublished(doc)) {
    payload.logger.info(`Revalidating unpublished post at path: /${previousDoc.slug}`)
    revalidatePath(`/${previousDoc.slug}`)
    revalidatePath('/')
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    revalidatePath(`/${doc.slug}`)
    revalidatePath('/')
  }

  return doc
}
