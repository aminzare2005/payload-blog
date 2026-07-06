import Image from 'next/image'

import { getUserAvatar } from '@/lib/authors'
import type { User } from '@/payload-types'

const sizeClasses = {
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
} as const

type AuthorAvatarProps = {
  user: User
  size?: keyof typeof sizeClasses
  className?: string
}

export function AuthorAvatar({ user, size = 'sm', className = '' }: AuthorAvatarProps) {
  const avatar = getUserAvatar(user)
  const sizeClass = sizeClasses[size]

  if (avatar?.url) {
    return (
      <Image
        alt={avatar.alt || user.name}
        className={`shrink-0 rounded-full border-2 border-background object-cover ${sizeClass} ${className}`}
        draggable={false}
        height={44}
        src={avatar.url}
        width={44}
      />
    )
  }

  return null
}
