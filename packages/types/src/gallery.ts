export type GallerySection = 'general' | 'antes-despues' | 'espacio' | 'eventos'

export interface IGalleryPhoto {
  _id: string
  url: string
  urlAfter?: string    // antes-despues: foto "después"
  pairLabel?: string   // antes-despues: etiqueta del servicio
  alt: string
  category: string
  section: GallerySection
  order: number
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface IGalleryPhotoCreate {
  url: string
  urlAfter?: string
  pairLabel?: string
  alt?: string
  category?: string
  section?: GallerySection
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
