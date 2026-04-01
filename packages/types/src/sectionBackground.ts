export interface ISectionBackground {
  _id: string
  pageSlug: string
  sectionKey: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

/** Map of sectionKey → imageUrl (null = no image configured) */
export type SectionBackgroundMap = Record<string, string | null>
