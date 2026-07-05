import type { Metadata } from 'next'
import React from 'react'

import { SiteFooter } from '@/components/blog/SiteFooter'
import { SiteHeader } from '@/components/blog/SiteHeader'
import { siteConfig } from '@/config/site'

import '../globals.css'
import { myFont } from '@/lib/fonts'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 2880,
        height: 1620,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html className={`${myFont.className} ${myFont.variable}`} dir="rtl" lang="fa" suppressHydrationWarning>
      <body>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
