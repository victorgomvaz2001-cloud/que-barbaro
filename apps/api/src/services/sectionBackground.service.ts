import { SectionBackground } from '../models/SectionBackground.model'
import type { SectionBackgroundMap } from '@falcanna/types'

export const sectionBackgroundService = {
  async getByPage(pageSlug: string): Promise<SectionBackgroundMap> {
    const docs = await SectionBackground.find({ pageSlug }).lean()
    return Object.fromEntries(docs.map((d) => [d.sectionKey, d.imageUrl ?? null]))
  },

  async upsert(pageSlug: string, sectionKey: string, imageUrl: string | null) {
    return SectionBackground.findOneAndUpdate(
      { pageSlug, sectionKey },
      { imageUrl },
      { upsert: true, new: true },
    ).lean()
  },

  async remove(pageSlug: string, sectionKey: string) {
    return SectionBackground.findOneAndDelete({ pageSlug, sectionKey }).lean()
  },
}
