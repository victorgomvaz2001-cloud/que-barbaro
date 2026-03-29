import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import type { IBlogPost } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

async function fetchPost(slug: string): Promise<IBlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch {
    return null
  }
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [locale, t, post] = await Promise.all([
    getLocale(),
    getTranslations('blog'),
    fetchPost(slug),
  ])

  if (!post) notFound()

  const seoRoute = locale === 'es' ? `/blog/${slug}` : `/${locale}/blog/${slug}`

  return (
    <>
      <SEOHead
        route={seoRoute}
        fallback={{
          title: `${post.title} — Qué Bárbaro`,
          description: post.excerpt,
        }}
      />

      {/* Banner: imagen + título + info superpuestos */}
      <div className={`relative w-full overflow-hidden bg-navy ${post.image ? 'h-[80vh] min-h-[560px]' : 'min-h-[420px]'}`}>
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        )}

        {/* Gradiente de abajo */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />

        {/* Contenido superpuesto — centrado verticalmente con padding simétrico */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 py-16 md:px-12 md:py-20">
          <div className="mx-auto w-full max-w-4xl">

            {/* Category */}
            {post.category && (
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-orange">
                {post.category}
              </p>
            )}

            {/* Title */}
            <h1 className="font-primary text-4xl uppercase leading-tight tracking-wide text-white md:text-6xl lg:text-7xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                {post.excerpt}
              </p>
            )}

            {/* Author + date */}
            <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-6">
              {post.authorImage && (
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-white/10">
                  <Image
                    src={post.authorImage}
                    alt={post.author}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="text-xs uppercase tracking-widest text-white/50">
                <span className="text-white/30">{t('by')} </span>
                <span className="text-white/80">{post.author}</span>
                <span className="mx-2 text-white/20">·</span>
                <span>{formatDate(post.publishedAt, locale)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Article wrapper */}
      <article className="px-8 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl">

          {/* Back link */}
          <Link
            href="/blog"
            className="mb-10 inline-block text-xs uppercase tracking-widest text-navy/40 transition-opacity hover:opacity-70"
          >
            {t('backToBlog')}
          </Link>

          {/* Content */}
          {post.content && (
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Footer nav */}
          <div className="mt-16 border-t border-navy/10 pt-10">
            <Link
              href="/blog"
              className="text-xs uppercase tracking-widest text-navy/40 transition-opacity hover:opacity-70"
            >
              {t('backToBlog')}
            </Link>
          </div>

        </div>
      </article>
    </>
  )
}
