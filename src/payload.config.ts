import { mongooseAdapter } from '@payloadcms/db-mongodb'
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

export default buildConfig({
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
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
