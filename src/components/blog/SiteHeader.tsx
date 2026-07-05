import Link from 'next/link'

import { BlogContainer } from '@/components/blog/BlogContainer'
import { NextMark } from '@/components/blog/NextMark'
import { siteConfig } from '@/config/site'

const navLinks = [{ href: '/admin', label: 'پنل مدیریت', external: true }]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-warm-surface/85 px-6 py-4 backdrop-blur-xl">
      <BlogContainer className="px-0">
        <nav className="flex h-8 items-center justify-between">
          <Link
            className="group flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706]"
            href="/"
          >
            <NextMark className="size-4 shrink-0 text-[#b45309] transition-opacity group-hover:opacity-80" />
            <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
            <span className="text-sm font-medium tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-warm-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706]"
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://aminzare.me"
              target="_blank"
              className="rounded-md flex items-center gap-1 justify-center px-3 py-1.5 text-sm bg-black text-white transition-colors hover:bg-black/80"
            >
              پورتفولیو من
            </Link>
          </div>
        </nav>
      </BlogContainer>
    </header>
  )
}
