import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    plural: 'کاربران',
    singular: 'کاربر',
  },
  admin: {
    useAsTitle: 'email',
    group: 'مجموعه‌ها',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
