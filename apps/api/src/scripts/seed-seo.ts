import 'dotenv/config'
import mongoose from 'mongoose'
import { SEO } from '../models/SEO.model'
import { env } from '../config/env'

const BASE_URL = 'https://falcanna.com'
const OG_IMAGE = 'https://falcanna.com/og-default.jpg'

const HREFLANG_ALTERNATES = {
  es: `${BASE_URL}/`,
  en: `${BASE_URL}/en`,
  'x-default': `${BASE_URL}/`,
}

interface SeedEntry {
  route: string
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  canonical?: string
}

const seoData: SeedEntry[] = [
  {
    route: '/',
    title: 'Falcanna - Genética Cannabis Premium',
    description:
      'Falcanna cría y distribuye genética de cannabis premium en Washington y Oklahoma. Descubre nuestras variedades galardonadas.',
    ogTitle: 'Falcanna - Genética Cannabis Premium',
    ogDescription: 'Genética de cannabis galardonada criada para potencia, sabor y consistencia.',
    canonical: `${BASE_URL}/`,
  },
  {
    route: '/en',
    title: 'Falcanna - Premium Cannabis Genetics',
    description:
      'Falcanna breeds and distributes premium cannabis genetics across Washington and Oklahoma. Discover our award-winning strains.',
    ogTitle: 'Falcanna - Premium Cannabis Genetics',
    ogDescription: 'Award-winning cannabis genetics bred for potency, flavor, and consistency.',
    canonical: `${BASE_URL}/en`,
  },
]

function buildDocument(entry: SeedEntry) {
  const ogTitle = entry.ogTitle ?? entry.title
  const ogDesc = entry.ogDescription ?? entry.description

  return {
    route: entry.route,
    title: entry.title,
    description: entry.description,
    og: {
      title: ogTitle,
      description: ogDesc,
      image: OG_IMAGE,
      url: entry.canonical ?? `${BASE_URL}${entry.route}`,
      type: 'website',
    },
    twitterCard: {
      card: 'summary_large_image' as const,
      title: ogTitle,
      description: ogDesc,
      image: OG_IMAGE,
    },
    canonical: entry.canonical ?? `${BASE_URL}${entry.route}`,
    alternates: {
      languages: HREFLANG_ALTERNATES,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

async function seed() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(env.MONGODB_URI)

  let created = 0
  let updated = 0

  for (const entry of seoData) {
    const doc = buildDocument(entry)
    const existing = await SEO.findOne({ route: entry.route })

    if (existing) {
      await SEO.findOneAndUpdate({ route: entry.route }, { $set: doc }, { runValidators: true })
      updated++
      console.log(`  updated  ${entry.route}`)
    } else {
      await SEO.create(doc)
      created++
      console.log(`  created  ${entry.route}`)
    }
  }

  console.log(`\nDone - ${created} created, ${updated} updated (${seoData.length} total routes)`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
