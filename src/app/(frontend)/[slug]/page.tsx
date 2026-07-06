import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogContainer } from '@/components/blog/BlogContainer'
import { PostHero } from '@/components/blog/PostHero'
import { RichTextContent } from '@/components/blog/RichTextContent'
import { getPublishedPostBySlug, getPublishedPostSlugs } from '@/lib/posts'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs()

  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    return {
      title: 'مطلب پیدا نشد',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogContainer className="py-8 md:py-12" variant="article">
      <article className="flex flex-col">
        <PostHero post={post} />
        {post.content && <RichTextContent content={post.content} />}
      </article>
    </BlogContainer>
  )
}
