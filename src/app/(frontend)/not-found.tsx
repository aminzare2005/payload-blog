import Link from 'next/link'

import { BlogContainer } from '@/components/blog/BlogContainer'

export default function NotFound() {
  return (
    <BlogContainer className="py-24" variant="article">
      <p className="text-sm text-muted-foreground">۴۰۴</p>
      <h1 className="mt-2 text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-tight tracking-tighter text-foreground">
        صفحه پیدا نشد
      </h1>
      <p className="mt-3 text-muted-foreground">این صفحه وجود ندارد یا منتقل شده است.</p>
      <Link
        className="blog-link mt-8 inline-flex text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706]"
        href="/"
      >
        بازگشت صفحه اصلی
      </Link>
    </BlogContainer>
  )
}
