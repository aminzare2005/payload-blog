import { BlogContainer } from '@/components/blog/BlogContainer'
import { NextMark } from '@/components/blog/NextMark'
import { siteConfig } from '@/config/site'
import { Link } from '@payloadcms/ui'

const footerColumns = [
  {
    title: 'منابع',
    links: [
      { href: '/', label: 'صفحه اصلی' },
      { href: '/admin', label: 'پنل مدیریت', external: true },
      { href: 'https://github.com/aminzare2005/payload-blog', label: 'گیتهاب', external: true },
    ],
  },
  {
    title: 'بیشتر',
    links: [
      { href: 'https://payloadcms.com/docs', label: 'پیلود چیه؟', external: true },
      { href: 'https://aminzare.me', label: 'پورتفولیو من', external: true },
      // { href: 'https://x.com/cwpslxck', label: 'توییتر من', external: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-warm-surface/60">
      <BlogContainer className="px-4 py-9 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 justify-center items-start">
          <div className="col-span-full flex flex-col gap-4 sm:col-span-1">
            <Link className="flex w-fit gap-2 justify-center items-center" href="/">
              <NextMark className="size-4 text-[#b45309]" />
              <span className="text-sm font-medium text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="max-w-xs text-sm leading-5 text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4 justify-center items-center">
              <h4 className="mb-3 text-sm font-medium leading-5 text-foreground justify-center items-center">
                {column.title}
              </h4>
              <div className="flex flex-col gap-3 justify-center items-center">
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    className="w-fit text-sm leading-5 text-muted-foreground transition-colors hover:text-[#b45309] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706]"
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          dir="ltr"
          className="mt-12 flex flex-col gap-4 justify-center items-center border-t border-border pt-8"
        >
          <Link
            href="https://aminzare.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground"
          >
            © {new Date().getFullYear()} {siteConfig.nameEn} by {siteConfig.authorEn}
          </Link>
        </div>
      </BlogContainer>
    </footer>
  )
}
