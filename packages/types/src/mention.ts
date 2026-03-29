export interface IMention {
  _id: string
  name: string       // internal identifier (not shown to users)
  logoUrl: string    // logo image URL
  link: string       // URL to the publication website
  order: number
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface IMentionCreate {
  name: string
  logoUrl: string
  link: string
  order?: number
}

export type IMentionUpdate = Partial<IMentionCreate & { visible: boolean }>

export interface IMentionConfig {
  maxDisplay: number // 0 = show all visible
}
