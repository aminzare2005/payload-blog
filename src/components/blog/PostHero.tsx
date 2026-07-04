import Image from 'next/image'
import Link from 'next/link'

import { formatBlogDate } from '@/lib/format'
import type { Media, Post } from '@/payload-types'

type PostHeroProps = {
  post: Post
}

function getCoverImage(post: Post): Media | null {
  if (!post.coverImage || typeof post.coverImage !== 'object') {
    return null
  }

  return post.coverImage
}

function BackArrowIcon() {
  return (
    <svg
      aria-hidden
      className="size-4 shrink-0 rtl:rotate-180"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        clipRule="evenodd"
        d="m6.47 13.78.53.53 1.06-1.06-.53-.53-3.97-3.97H15v-1.5H3.56l3.97-3.97.53-.53L7 1.69l-.53.53L1.4 7.29a1 1 0 0 0 0 1.42z"
        fillRule="evenodd"
      />
    </svg>
  )
}

export function PostHero({ post }: PostHeroProps) {
  const cover = getCoverImage(post)

  return (
    <header className="mb-12">
      <Link
        className="mb-16 inline-flex w-fit items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-[#b45309] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706]"
        draggable={false}
        href="/"
      >
        <BackArrowIcon />
        بازگشت به وبلاگ
      </Link>

      {post.publishedAt && (
        <time
          className="mb-3 block text-sm leading-5 text-muted-foreground"
          dateTime={post.publishedAt}
        >
          {formatBlogDate(post.publishedAt)}
        </time>
      )}

      <h1 className="text-balance text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-[1.17] tracking-[-0.02em] text-foreground">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="mt-6 text-base leading-7 text-muted-foreground">{post.excerpt}</p>
      )}

      {cover?.url && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-lg border border-border bg-warm-accent shadow-[0_4px_20px_rgba(42,34,24,0.08)]">
          <Image
            alt={cover.alt}
            className="object-cover"
            fill
            draggable={false}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            src={cover.url}
          />
        </div>
      )}
    </header>
  )
}
