export interface ISEOOpenGraph {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export interface ISEOTwitterCard {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  title?: string
  description?: string
  image?: string
}

export interface ISEORobots {
  index?: boolean
  follow?: boolean
  googleBot?: {
    index?: boolean
    follow?: boolean
  }
}

export interface ISEOAlternates {
  languages?: Record<string, string>
}

export interface ISEOPage {
  _id: string
  route: string
  title: string
  description: string
  og: ISEOOpenGraph
  twitterCard: ISEOTwitterCard
  canonical?: string
  alternates?: ISEOAlternates
  robots?: ISEORobots
  createdAt: string
  updatedAt: string
}

export type ISEOPageCreate = Omit<ISEOPage, '_id' | 'createdAt' | 'updatedAt'>
export type ISEOPageUpdate = Partial<ISEOPageCreate>
