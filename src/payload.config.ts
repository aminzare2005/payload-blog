import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fa } from '@payloadcms/translations/languages/fa'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { siteConfig } from './config/site'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    dateFormat: 'd MMMM yyyy، HH:mm',
    meta: {
      titleSuffix: `| ${siteConfig.name}`,
    },
    components: {
      graphics: {
        Icon: '/components/admin/AdminIcon',
        Logo: '/components/admin/AdminLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts],
  editor: lexicalEditor({
    admin: {
      placeholder: 'متن مطلب را اینجا بنویسید…',
    },
  }),
  i18n: {
    fallbackLanguage: 'fa',
    supportedLanguages: { fa },
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  plugins: [],
})

/**
 * Payload's bundled Persian (fa) pack ships the Lexical heading-dropdown label
 * as the untranslated placeholder "[SKIPPED]" (H1–H6 all render as "[SKIPPED]").
 * The editor's feature translations are deep-merged over user translations during
 * config sanitization, so an `i18n.translations` override would be clobbered.
 * Instead we patch the sanitized config after it resolves — this is the last
 * write, so it wins at runtime.
 */
export default config.then((sanitized) => {
  const fa = sanitized.i18n?.translations?.fa as Record<string, unknown> | undefined
  if (fa) {
    const lexical = (fa.lexical ??= {}) as Record<string, unknown>
    const heading = (lexical.heading ??= {}) as Record<string, unknown>
    heading.label = 'عنوان {{headingLevel}}'
  }
  return sanitized
})
