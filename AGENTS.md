# Agent instructions

Guidance for AI coding agents working in this repository.

## Project summary

Persian (RTL) blog: **Payload CMS 3** + **Next.js 16 App Router**. Public routes live under `src/app/(frontend)/`; admin and API under `src/app/(payload)/`. Site copy and metadata are in `src/config/site.ts`.

## Commands

```bash
npm install
npm run dev              # http://localhost:3000 — blog; /admin — CMS
npm run build
npm run start
npm run lint
npm run generate:types   # after collection/schema changes
npm run generate:importmap  # after adding custom admin components
npm run seed:posts       # optional RSS seed (needs DB + env)
npm run test:int         # Vitest — uses real Payload + DB
npm run test:e2e         # Playwright
```

Node: `^18.20.2 || >=20.9.0`. Path alias: `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`.

## Environment

Required:

- `PAYLOAD_SECRET`
- `POSTGRES_URL`

Optional:

- `BLOB_READ_WRITE_TOKEN` — when set, media uploads use Vercel Blob; when unset, local Payload media storage is used

Do not commit `.env`, `.env.local`, or secrets.

## Architecture

```text
src/app/(frontend)/     Public blog (RTL, lang="fa")
src/app/(payload)/      Admin panel, REST API, GraphQL
src/collections/        Payload collections (Users, Media, Posts)
src/lib/posts.ts        Server-side queries for published posts only
src/payload.config.ts   DB adapter, Lexical editor, fa locale, Blob plugin
```

### Publishing model

A post is **public** when `publishedAt` is non-null and `<= now`. Drafts have no `publishedAt`. All public queries go through `src/lib/posts.ts` — do not duplicate publish logic elsewhere.

### Cache revalidation

`Posts` hooks call `revalidatePath('/')` and `revalidatePath('/${slug}')` on publish, unpublish, slug change, and delete. Pass `context: { disableRevalidate: true }` on Local API writes in tests/seeds to skip revalidation when needed.

### Persian / RTL

- Frontend layout: `dir="rtl"` `lang="fa"` in `src/app/(frontend)/layout.tsx`
- Admin: `i18n.fallbackLanguage: 'fa'` in `payload.config.ts`
- New Lexical documents default to RTL in `Posts` collection `content.defaultValue`
- `payload.config.ts` patches the fa Lexical heading-dropdown label after config sanitization (Payload upstream quirk)

## Conventions

### Code style

- TypeScript strict mode; prefer existing patterns over new abstractions
- Functional React components; Server Components for data fetching on the frontend
- Tailwind + shadcn/ui (`src/components/ui/`); blog-specific UI in `src/components/blog/`
- Keep changes minimal and scoped to the task
- Match Persian labels in admin when adding collection fields

### Payload patterns

- Regenerate types after schema changes: `npm run generate:types`
- Custom admin components: register in `payload.config.ts`, then `npm run generate:importmap`
- Local API **bypasses access control by default** — use `overrideAccess: false` when enforcing user permissions in API routes
- Thread `req` through nested Payload operations inside hooks to preserve transactions
- Use `req.context` flags to prevent hook loops (see revalidation hooks)

### Frontend data fetching

Use helpers in `src/lib/posts.ts`:

- `getPublishedPosts()` — homepage list
- `getPublishedPostBySlug(slug)` — single post
- `getPublishedPostSlugs()` — static params for `[slug]`

Render Lexical content with `<RichText data={content} />` from `@payloadcms/richtext-lexical/react` (see `RichTextContent.tsx`).

### Site config

Update `src/config/site.ts` for name, author, and SEO defaults — not hardcoded strings in components.

## Common tasks

| Task | Where to look |
| --- | --- |
| Add post field | `src/collections/Posts/index.ts` → `generate:types` |
| Change publish rules | `src/lib/posts.ts` + `Posts` access/hooks |
| Blog layout / header | `src/components/blog/`, `(frontend)/layout.tsx` |
| Admin branding | `src/components/admin/`, `(payload)/custom.scss` |
| Media / uploads | `src/collections/Media.ts`, `payload.config.ts` plugins |
| Date formatting | `src/lib/format.ts` |

## Testing

- Integration: `tests/int/` — boots Payload via `@/payload.config`
- E2E: `tests/e2e/` — admin login helpers in `tests/helpers/`
- Tests expect `POSTGRES_URL` and `PAYLOAD_SECRET` (see `test.env` for Node options)

## Pitfalls

1. **Do not** expose draft posts on the frontend — always filter through `publishedWhere()` in `posts.ts`.
2. **Import map** — admin custom components must use paths registered in `payload.config.ts` `admin.importMap.baseDir`.
3. **Lexical heading label** — do not remove the post-sanitize patch in `payload.config.ts` without verifying the fa translation fix upstream.
4. **Scripts folder** — excluded from `tsconfig.json`; seed script imports config directly.

## References

- [Payload docs](https://payloadcms.com/docs)
- [Payload llms-full.txt](https://payloadcms.com/llms-full.txt) — full docs for agents
