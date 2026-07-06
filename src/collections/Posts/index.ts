import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    plural: 'مطالب',
    singular: 'مطلب',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', 'updatedAt'],
    group: 'محتوا',
    description: 'مطالب وبلاگ',
    listSearchableFields: ['title', 'slug', 'excerpt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-publishedAt',
  trash: true,
  hooks: {
    afterChange: [revalidatePost],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'عنوان',
      required: true,
      admin: {
        rtl: true,
        placeholder: 'عنوان مطلب را وارد کنید',
      },
    },
    slugField(),
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'خلاصه',
      required: true,
      admin: {
        rtl: true,
        placeholder: 'خلاصه‌ای کوتاه از مطلب',
        rows: 3,
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'متن',
      required: true,
      // Start new documents in RTL so the caret, empty lines and undetected
      // blocks default to the right. Lexical still auto-flips individual blocks
      // to LTR when their content is left-to-right (e.g. English, code).
      defaultValue: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'rtl',
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              direction: 'rtl',
              textFormat: 0,
              textStyle: '',
              children: [],
            },
          ],
        },
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر کاور',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'نویسنده',
      admin: {
        position: 'sidebar',
        description: 'نویسنده‌ای که در وبلاگ نمایش داده می‌شود',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'تاریخ انتشار',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        description: 'برای پیش‌نویس خالی بگذارید. با تعیین تاریخ، مطلب منتشر می‌شود.',
      },
    },
  ],
  timestamps: true,
}
