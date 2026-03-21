import type { IBlogPost } from '@falcanna/types'
import BlogCard from './BlogCard'

interface BlogGridProps {
  posts: IBlogPost[]
}

export default function BlogGrid({ posts }: BlogGridProps) {
  if (!posts.length) {
    return (
      <p className="py-20 text-center text-sm uppercase tracking-widest text-navy/30">
        No hay artículos disponibles
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  )
}
