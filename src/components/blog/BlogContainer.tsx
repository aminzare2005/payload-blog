import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type BlogContainerProps = {
  children: ReactNode
  className?: string
  variant?: 'page' | 'article'
}

export function BlogContainer({ children, className, variant = 'page' }: BlogContainerProps) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full px-4',
        variant === 'article' ? 'max-w-[860px]' : 'max-w-[1232px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
