export interface IBlogCategory {
  _id: string
  slug: string
  nameEs: string
  nameEn: string
  descriptionEs: string
  descriptionEn: string
  order: number
  createdAt: string
  updatedAt: string
}

export type IBlogCategoryCreate = Omit<IBlogCategory, '_id' | 'createdAt' | 'updatedAt'>
export type IBlogCategoryUpdate = Partial<IBlogCategoryCreate>

export interface IBlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  author: string
  authorImage?: string
  featured?: boolean
  category: string
  locale: string
  publishedAt: string
  draft: boolean
  createdAt: string
  updatedAt: string
}

export type IBlogPostCreate = Omit<IBlogPost, '_id' | 'createdAt' | 'updatedAt' | 'content'> & {
  content?: string
}
export type IBlogPostUpdate = Partial<IBlogPostCreate>

export interface BlogPageResponse {
  data: IBlogPost[]
  total: number
  hasMore: boolean
}
