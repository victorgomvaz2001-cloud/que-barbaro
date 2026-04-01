import type { SectionBackgroundMap } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

export async function getSectionBackgrounds(pageSlug: string): Promise<SectionBackgroundMap> {
  try {
    const res = await fetch(`${API_URL}/section-backgrounds/${pageSlug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const json = (await res.json()) as { data: SectionBackgroundMap }
    return json.data ?? {}
  } catch {
    return {}
  }
}
