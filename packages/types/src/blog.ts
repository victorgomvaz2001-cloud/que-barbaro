export interface IBlogPost {
  _id: string
  title: string
  slug: string
  content: string
  image?: string
  author: string
  publishedAt: string
  draft: boolean
  createdAt: string
  updatedAt: string
}

export type IBlogPostCreate = Omit<IBlogPost, '_id' | 'createdAt' | 'updatedAt' | 'content'> & {
  content?: string
}
export type IBlogPostUpdate = Partial<IBlogPostCreate>
