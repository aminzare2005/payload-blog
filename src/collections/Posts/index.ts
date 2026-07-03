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
    defaultColumns: ['title', 'publishedAt', 'updatedAt'],
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
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
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
