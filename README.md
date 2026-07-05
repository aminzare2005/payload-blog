# payload-blog

A Persian (RTL) blog built with [Payload CMS 3](https://payloadcms.com) and [Next.js](https://nextjs.org). Content is managed in the admin panel; the public site renders published posts with Lexical rich text, cover images, and on-demand cache revalidation.

## Features

- **RTL-first** — Persian admin UI, RTL layout, and Lexical editor defaults tuned for right-to-left writing
- **Posts collection** — title, slug, excerpt, rich text, cover image, and `publishedAt` for draft/publish workflow
- **Vercel Postgres** — database via `@payloadcms/db-vercel-postgres`
- **Vercel Blob** — optional media storage when `BLOB_READ_WRITE_TOKEN` is set
- **Public blog** — homepage grid and `/[slug]` article pages with static generation
- **Seed script** — import sample posts from an RSS feed (`pnpm seed:posts`)

## Tech stack

| Layer | Technology |
| --- | --- |
| CMS | Payload 3.85 |
| Framework | Next.js 16 (App Router) |
| Database | Vercel Postgres |
| Media | Vercel Blob (optional) or local `/api/media` |
| Editor | Lexical (`@payloadcms/richtext-lexical`) |
| UI | Tailwind CSS 4, shadcn/ui, Geist font |
| Tests | Vitest (integration), Playwright (e2e) |

## Prerequisites

- Node.js `^18.20.2` or `>=20.9.0`
- A PostgreSQL connection string (e.g. [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or local Postgres)
- Optional: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) token for cloud media uploads

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env` or `.env.local` in the project root:

```env
PAYLOAD_SECRET=your-secret-at-least-32-chars
POSTGRES_URL=postgres://user:password@host:5432/database

# Optional — enables Vercel Blob for the Media collection
BLOB_READ_WRITE_TOKEN=
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the blog and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS. On first visit to the admin panel, create your admin user.

### 4. Seed sample posts (optional)

Requires a configured database and admin user (the script uses Payload's Local API):

```bash
npm run seed:posts
```

This fetches recent items from the Zoomit RSS feed and creates published posts with cover images.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run generate:types` | Regenerate `src/payload-types.ts` |
| `npm run generate:importmap` | Regenerate admin import map |
| `npm run seed:posts` | Import sample posts from RSS |
| `npm run lint` | Run ESLint |
| `npm run test:int` | Vitest integration tests |
| `npm run test:e2e` | Playwright e2e tests |
| `npm run test` | Run all tests |

## Project structure

```text
src/
├── app/
│   ├── (frontend)/          # Public blog (RTL)
│   │   ├── page.tsx         # Homepage — post grid
│   │   └── [slug]/page.tsx  # Single post
│   └── (payload)/           # Payload admin + REST/GraphQL API
├── collections/
│   ├── Posts/               # Blog posts + revalidation hooks
│   ├── Media.ts
│   └── Users.ts
├── components/
│   ├── blog/                # Site chrome and post UI
│   ├── admin/               # Custom admin branding
│   └── ui/                  # shadcn/ui primitives
├── config/site.ts           # Site name, author, metadata
├── lib/
│   ├── posts.ts             # Published-post queries
│   ├── lexical.ts           # Lexical helpers
│   └── format.ts            # Date/text formatting
└── payload.config.ts        # Payload + DB + storage config
```

## Content model

### Posts

Posts are **published** when `publishedAt` is set to a date in the past. Leave it empty to keep a draft. The public site only queries posts where `publishedAt` exists and is `<= now`.

Changing or deleting a post triggers Next.js `revalidatePath` for `/` and the post URL (see `src/collections/Posts/hooks/revalidatePost.ts`).

### Media

Upload collection used for post cover images. When Vercel Blob is enabled, files are stored in blob storage; otherwise Payload serves them locally.

### Users

Auth-enabled collection for admin access. Only authenticated users can create, update, or delete posts.

## Customization

- **Site branding** — edit `src/config/site.ts` (name, author, description)
- **Admin appearance** — `src/components/admin/AdminLogo.tsx`, `AdminIcon.tsx`, and `src/app/(payload)/custom.scss`
- **Frontend styling** — `src/app/globals.css`, blog components under `src/components/blog/`

After changing Payload collections or admin components, run:
(if dev server is running these will be automaticly run)

```bash
npm run generate:types
npm run generate:importmap
```

## Deployment

This project is set up for [Vercel](https://vercel.com):

1. Connect the repo and add `PAYLOAD_SECRET`, `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN`
2. Deploy — Next.js builds the frontend and Payload admin together

**Postgres** (`POSTGRES_URL`), not MongoDB. Use Vercel Postgres, a managed Postgres service, or uncomment the Postgres service in `docker-compose.yml` if you want local Docker-based development.

## Testing

Integration tests boot Payload against your configured database:

```bash
npm run test:int
```

E2e tests require a running dev server (Playwright starts one automatically):

```bash
npm run test:e2e
```

## License

MIT
