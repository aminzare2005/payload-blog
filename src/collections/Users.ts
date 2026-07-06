import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    plural: 'کاربران',
    singular: 'کاربر',
  },
  admin: {
    useAsTitle: 'name',
    group: 'مدیریت',
    description: 'کاربرانی که ثبتنام کردن',
    listSearchableFields: ['name', 'email'],
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'name',
      type: 'text',
      label: 'نام',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'آواتار',
      admin: {
        description: 'تصویر پروفایل نویسنده در وبلاگ',
      },
    },
  ],
}
