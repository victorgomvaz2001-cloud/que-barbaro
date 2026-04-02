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

export default function BlogCard({ post }: { post: IBlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      {/* Image - 16:9 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-navy/5">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-navy/10" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col pt-5">
        {post.category && (
          <span className="mb-2 text-xs uppercase tracking-widest text-orange">
            {post.category}
          </span>
        )}

        <h3 className="font-secondary line-clamp-2 text-xl uppercase leading-snug tracking-wide text-navy group-hover:opacity-70 transition-opacity md:text-2xl">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 font-neue text-sm leading-relaxed text-navy">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-4 font-neue text-xs uppercase tracking-widest text-navy/40">
          {post.author && <span>{post.author}</span>}
          {post.author && <span>·</span>}
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}
