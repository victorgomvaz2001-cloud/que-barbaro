# ¡Qué Bárbaro! - Monorepo

TypeScript monorepo powered by **Turborepo** + **Yarn workspaces**.

## Stack

| Layer | Tech |
|---|---|
| Web | Next.js 15 (App Router, SSR) |
| API | Express.js 4 |
| Database | MongoDB + Mongoose |
| Storage | AWS S3 (presigned URLs) |
| Auth | JWT + httpOnly cookies |
| Types | Shared types package |
| Build | Turborepo |
| Package manager | yarn (Berry) |

---

## Structure

```
que-barbaro/
├── apps/
│   ├── web/          # Next.js 15 - sitio público + admin
│   └── api/          # Express.js REST API
├── packages/
│   ├── tsconfig/     # TS base configs
│   └── eslint-config/ # ESLint config compartida
├── turbo.json
├── package.json
└── yarn.lock
```

---

## Prerequisites

- Node.js >= 20
- MongoDB running locally (or set `MONGODB_URI` to an Atlas URL)

---

## Setup

```bash
# 1. Install dependencies
yarn install

# 2. Configure environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# Edit the .env files with your real values
```

### apps/api/.env

```
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/falcanna
JWT_SECRET=your-secret-at-least-16-chars
JWT_EXPIRES_IN=7d
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
FRONTEND_URL=http://localhost:3000
```

### apps/web/.env.local

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Development

```bash
# Start both api (port 4000) and web (port 3000) in parallel
yarn dev
```

---

## Build

```bash
yarn build
```

---

## Testing

```bash
# Run all tests with coverage
yarn test

# CI mode
yarn test:ci
```

---

## Lint

```bash
yarn lint
```

---

## Public routes (`apps/web`)

El sitio usa rutas con `locale` (`/es`, `/en`, ...). A continuación se listan las rutas principales en castellano; para otros idiomas se antepone el locale, por ejemplo `/en/...`.

| Route (ES) | Description |
|---|---|
| `/` o `/es` | Inicio |
| `/es/el-salon` | Página \"El Salón\" |
| `/es/servicios` | Listado de servicios |
| `/es/galeria` | Galería de fotos |
| `/es/blog` | Blog |
| `/es/blog/[slug]` | Detalle de post |
| `/es/contacto` | Contacto |
| `/es/reservar-cita` | Reserva online (Treatwell) |
| `/es/aviso-legal` | Aviso legal |
| `/es/politica-privacidad` | Política de privacidad |
| `/es/politica-cookies` | Política de cookies |

---

## Admin routes (`/admin`)

Protected by `middleware.ts` - redirects to `/admin/login` if no `token` cookie.

| Route | Description |
|---|---|
| `/admin/login` | Login |
| `/admin/register` | Register first admin |
| `/admin/dashboard` | Dashboard |
| `/admin/seo` | SEO list |
| `/admin/seo/[id]` | Edit SEO |
| `/admin/blog` | Blog list |
| `/admin/blog/new` | New post |
| `/admin/blog/[id]` | Edit post |
| `/admin/press` | Press list |
| `/admin/press/new` | New press item |
| `/admin/press/[id]` | Edit press item |
| `/admin/strains` | Strains list |
| `/admin/strains/[id]` | Edit strain |
| `/admin/locations` | Locations list |
| `/admin/locations/[id]` | Edit location |
| `/admin/users` | Users list |
| `/admin/users/[id]` | Edit user |

---

## API endpoints (`apps/api`) - legacy

Base: `http://localhost:4000/api`

### Public

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/seo?route=/es/servicios` | SEO by route |
| GET | `/blog` | Published blog posts |
| GET | `/blog/:slug` | Blog post by slug |
| GET | `/press` | Published press posts |
| GET | `/press/:slug` | Press post by slug |
| GET | `/strains?region=us-wa` | Strains (optional region filter) |
| GET | `/strains/:slug` | Strain by slug |
| GET | `/locations?region=us-wa` | Locations (optional region filter) |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login → sets httpOnly cookie |
| POST | `/auth/register` | Register new user |
| POST | `/auth/logout` | Clears cookie |
| GET | `/auth/me` | Current user (requires auth) |

### Admin (require JWT cookie)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/seo/admin` | All SEO entries |
| POST | `/seo/admin` | Create SEO entry |
| PUT | `/seo/admin/:id` | Update SEO entry |
| DELETE | `/seo/admin/:id` | Delete SEO entry |
| POST | `/blog/admin` | Create blog post |
| PUT | `/blog/admin/:id` | Update blog post |
| DELETE | `/blog/admin/:id` | Delete blog post |
| POST | `/press/admin` | Create press item |
| PUT | `/press/admin/:id` | Update press item |
| DELETE | `/press/admin/:id` | Delete press item |
| POST | `/strains/admin` | Create strain |
| PUT | `/strains/admin/:id` | Update strain |
| DELETE | `/strains/admin/:id` | Delete strain |
| POST | `/locations/admin` | Create location |
| PUT | `/locations/admin/:id` | Update location |
| DELETE | `/locations/admin/:id` | Delete location |
| GET | `/admin/users` | List users |
| PUT | `/admin/users/:id` | Update user |
| DELETE | `/admin/users/:id` | Delete user |
| POST | `/admin/upload/presigned-url` | Get S3 presigned URL |

---

## SEO SSR

Every public `page.tsx` exports `generateMetadata` that fetches SEO from the API before render. This ensures `<title>`, `<meta description>`, OpenGraph, Twitter Card, canonical URL, and robots directives are present in the HTML source.

```ts
export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSEO('/es/servicios')
  return buildMetadata(seo, { title: 'Servicios' })
}
```

---

## Deployment (Railway)

Two services:

**API service**
- Root directory: `apps/api`
- Build: `yarn workspace api build`
- Start: `yarn workspace api start`
- Environment variables: all from `.env` above

**Web service**
- Root directory: `apps/web`
- Build: `yarn workspace web build`
- Start: `yarn workspace web start`
- `NEXT_PUBLIC_API_URL`: set to the public URL of the API service
