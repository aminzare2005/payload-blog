import Image from 'next/image'
import Link from 'next/link'

import { formatBlogDate } from '@/lib/format'
import type { Media, Post } from '@/payload-types'

type PostListItemProps = {
  post: Post
}

function getCoverImage(post: Post): Media | null {
  if (!post.coverImage || typeof post.coverImage !== 'object') {
    return null
  }

  return post.coverImage
}

export function PostListItem({ post }: PostListItemProps) {
  const cover = getCoverImage(post)

  return (
    <Link
      className="post-card group block p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706]"
      draggable={false}
      href={`/${post.slug}`}
    >
      {cover?.url && (
        <div className="relative mb-1 aspect-video overflow-hidden rounded-(--post-inner-radius) bg-warm-accent">
          <Image
            alt={cover.alt}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            fill
            draggable={false}
            sizes="(max-width: 768px) 100vw, 400px"
            src={cover.url}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col py-3">
        {post.publishedAt && (
          <time
            className="mb-3 block text-sm leading-5 text-muted-foreground"
            dateTime={post.publishedAt}
          >
            {formatBlogDate(post.publishedAt)}
          </time>
        )}

        <h2 className="text-xl mb-3 font-semibold leading-7 tracking-tight text-foreground transition-colors group-hover:text-[#b45309]">
          {post.title}
        </h2>

        {post.excerpt && (
          <div className="blog-prose text-[15px] leading-6 [&_p]:mb-0 [&_p]:mt-0 [&_p]:max-w-[360px] [&_p]:text-muted-foreground">
            <p>{post.excerpt}</p>
          </div>
        )}
      </div>
    </Link>
  )
}
