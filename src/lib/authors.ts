import type { Media, Post, User } from '@/payload-types'

export function getPostAuthor(post: Post): User | null {
  if (!post.author || typeof post.author !== 'object') {
    return null
  }

  return post.author
}

export function getUserAvatar(user: User): Media | null {
  if (!user.avatar || typeof user.avatar !== 'object') {
    return null
  }

  return user.avatar
}
