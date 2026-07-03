import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type LexicalTextNode = {
  detail: number
  format: number
  mode: string
  style: string
  text: string
  type: 'text'
  version: number
}

type LexicalParagraphNode = {
  children: LexicalTextNode[]
  direction: 'rtl'
  format: string
  indent: number
  type: 'paragraph'
  version: number
}

export function paragraphsToLexical(paragraphs: string[]): SerializedEditorState {
  const children: LexicalParagraphNode[] = paragraphs
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({
      children: [
        {
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text,
          type: 'text',
          version: 1,
        },
      ],
      direction: 'rtl',
      format: '',
      indent: 0,
      type: 'paragraph',
      version: 1,
    }))

  return {
    root: {
      children,
      direction: 'rtl',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  } as SerializedEditorState
}
