import 'dotenv/config'
import mongoose from 'mongoose'
import { Gallery } from '../models/Gallery.model'
import { env } from '../config/env'

// Portrait picsum seeds for hair-like before/after visuals
const PAIRS = [
  {
    pairLabel: 'Balayage Brasileño',
    category: 'coloracion',
    url: 'https://picsum.photos/seed/beforebalayage1/600/800',
    urlAfter: 'https://picsum.photos/seed/afterbalayage1/600/800',
    alt: 'Antes y después de Balayage Brasileño',
    order: 1,
  },
  {
    pairLabel: 'Babylights',
    category: 'coloracion',
    url: 'https://picsum.photos/seed/beforebaby2/600/800',
    urlAfter: 'https://picsum.photos/seed/afterbaby2/600/800',
    alt: 'Antes y después de Babylights',
    order: 2,
  },
  {
    pairLabel: 'Balayage Rubio',
    category: 'coloracion',
    url: 'https://picsum.photos/seed/beforerubio3/600/800',
    urlAfter: 'https://picsum.photos/seed/afterrubio3/600/800',
    alt: 'Antes y después de Balayage Rubio',
    order: 3,
  },
  {
    pairLabel: 'Keratin Infusion',
    category: 'tratamientos',
    url: 'https://picsum.photos/seed/beforekeratin4/600/800',
    urlAfter: 'https://picsum.photos/seed/afterkeratin4/600/800',
    alt: 'Antes y después de Keratin Infusion',
    order: 4,
  },
  {
    pairLabel: 'Danza de Rizos',
    category: 'cortes',
    url: 'https://picsum.photos/seed/beforerizos5/600/800',
    urlAfter: 'https://picsum.photos/seed/afterrizos5/600/800',
    alt: 'Antes y después de Danza de Rizos',
    order: 5,
  },
  {
    pairLabel: 'Softy Mood',
    category: 'tratamientos',
    url: 'https://picsum.photos/seed/beforesofty6/600/800',
    urlAfter: 'https://picsum.photos/seed/aftersofty6/600/800',
    alt: 'Antes y después de Softy Mood',
    order: 6,
  },
]

async function seed() {
  console.log('Connecting to MongoDB…')
  await mongoose.connect(env.MONGODB_URI)

  let created = 0
  let skipped = 0

  for (const pair of PAIRS) {
    const existing = await Gallery.findOne({
      section: 'antes-despues',
      pairLabel: pair.pairLabel,
    })
    if (existing) {
      console.log(`  skipped  ${pair.pairLabel}`)
      skipped++
      continue
    }
    await Gallery.create({
      ...pair,
      section: 'antes-despues',
      visible: true,
    })
    console.log(`  created  ${pair.pairLabel}`)
    created++
  }

  console.log(`\nDone - ${created} created, ${skipped} skipped (${PAIRS.length} total)`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
