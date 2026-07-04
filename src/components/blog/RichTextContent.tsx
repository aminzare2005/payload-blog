import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { cn } from '@/lib/utils'

type RichTextContentProps = {
  className?: string
  content: SerializedEditorState
}

export function RichTextContent({ className, content }: RichTextContentProps) {
  return (
    <div dir="auto" className={cn('blog-prose max-w-none', className)}>
      <RichText data={content} />
    </div>
  )
}
