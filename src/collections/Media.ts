import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    plural: 'رسانه‌ها',
    singular: 'رسانه',
  },
  admin: {
    group: 'محتوا',
    description: 'رسانه‌هایی که برای مطالب استفاده می‌شوند',
    listSearchableFields: ['alt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'متن جایگزین',
    },
  ],
  upload: true,
}
