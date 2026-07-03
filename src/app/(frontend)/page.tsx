import { BlogContainer } from '@/components/blog/BlogContainer'
import { PostListItem } from '@/components/blog/PostListItem'
import { siteConfig } from '@/config/site'
import { getPublishedPosts } from '@/lib/posts'

export default async function HomePage() {
  const { docs: posts } = await getPublishedPosts()

  return (
    <BlogContainer className="py-10">
      <div className="relative z-[1] my-6 w-full">
        <h1 className="text-3xl font-semibold leading-10 tracking-tighter text-foreground">
          {siteConfig.tagline}
        </h1>

        {posts.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">هنوز مطلبی منتشر نشده. از پنل مدیریت یک مطلب بسازید.</p>
        ) : (
          <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {posts.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </BlogContainer>
  )
}
