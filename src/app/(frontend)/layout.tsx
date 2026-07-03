import React from 'react'

import { SiteFooter } from '@/components/blog/SiteFooter'
import { SiteHeader } from '@/components/blog/SiteHeader'
import { siteConfig } from '@/config/site'

import '../globals.css'
import { myFont } from '@/lib/fonts'

export const metadata = {
  description: siteConfig.description,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
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
