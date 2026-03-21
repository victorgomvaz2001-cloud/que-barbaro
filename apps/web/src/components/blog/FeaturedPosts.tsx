import Image from 'next/image'
import Link from 'next/link'
import type { IBlogPost } from '@falcanna/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function LargeCard({ post }: { post: IBlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[520px] flex-col justify-end overflow-hidden bg-navy"
    >
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      )}
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent" />

      <div className="relative z-10 p-8 md:p-10">
        {post.category && (
          <span className="mb-4 inline-block bg-orange px-3 py-1 text-xs font-medium uppercase tracking-widest text-white">
            {post.category}
          </span>
        )}
        <h2 className="font-primary text-3xl uppercase leading-tight tracking-wide text-white md:text-4xl lg:text-5xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70 md:text-base">
            {post.excerpt}
          </p>
        )}
        <div className="mt-5 flex items-center gap-3 text-xs text-white/50 uppercase tracking-widest">
          {post.author && <span>{post.author}</span>}
          {post.author && <span>·</span>}
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}

function SmallCard({ post }: { post: IBlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-1 flex-col justify-end overflow-hidden bg-navy"
    >
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 1024px) 100vw, 30vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

      <div className="relative z-10 p-5 md:p-6">
        {post.category && (
          <span className="mb-2 inline-block border border-white/30 px-2 py-0.5 text-xs uppercase tracking-widest text-white/70">
            {post.category}
          </span>
        )}
        <h3 className="font-primary text-lg uppercase leading-snug tracking-wide text-white md:text-xl">
          {post.title}
        </h3>
        <p className="mt-2 text-xs text-white/50 uppercase tracking-widest">
          {formatDate(post.publishedAt)}
        </p>
      </div>
    </Link>
  )
}

interface FeaturedPostsProps {
  posts: IBlogPost[]
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts.length) return null

  const large = posts[0]!
  const small = posts.slice(1, 3)

  return (
    <section className="mb-20">
      <div className="flex flex-col gap-px lg:flex-row">
        {/* Large editorial card */}
        <div className="lg:flex-[3]">
          <LargeCard post={large} />
        </div>

        {/* Two stacked smaller cards */}
        {small.length > 0 && (
          <div className="flex flex-col gap-px lg:flex-[2]">
            {small.map((post) => (
              <SmallCard key={post._id} post={post} />
            ))}
            {/* fill empty slot if only 1 small */}
            {small.length === 1 && (
              <div className="flex-1 bg-cream" />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
