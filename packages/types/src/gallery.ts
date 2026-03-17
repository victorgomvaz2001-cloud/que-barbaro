export interface IGalleryPhoto {
  _id: string
  url: string
  alt: string
  category: string
  order: number
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface IGalleryPhotoCreate {
  url: string
  alt?: string
  category?: string
  order?: number
  visible?: boolean
}

export type IGalleryPhotoUpdate = Partial<IGalleryPhotoCreate>

export interface GalleryPageResponse {
  data: IGalleryPhoto[]
  total: number
  page: number
  hasMore: boolean
}
