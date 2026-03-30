export type GallerySection = 'general' | 'antes-despues' | 'espacio' | 'eventos' | 'services'

export interface IGalleryCategory {
  _id: string
  slug: string
  nameEs: string
  nameEn: string
  descriptionEs: string
  descriptionEn: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface IGalleryCategoryCreate {
  slug: string
  nameEs: string
  nameEn: string
  descriptionEs?: string
  descriptionEn?: string
  order?: number
  active?: boolean
}

export type IGalleryCategoryUpdate = Partial<IGalleryCategoryCreate>

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
