import 'dotenv/config'
import mongoose from 'mongoose'
import { GalleryCategory } from '../models/GalleryCategory.model'
import { env } from '../config/env'

const CATEGORIES = [
  {
    slug: 'cortes-peinados',
    nameEs: 'Cortes y peinados',
    nameEn: 'Cuts & styling',
    descriptionEs: 'Cortes personalizados y peinados que realzan tu estilo natural.',
    descriptionEn: 'Personalised cuts and styling that bring out your natural beauty.',
    order: 1,
  },
  {
    slug: 'color-rubios',
    nameEs: 'Coloración y rubios',
    nameEn: 'Colour & blondes',
    descriptionEs: 'Técnicas de coloración avanzadas: balayage, mechas, tintes y todo lo que necesitas para un rubio perfecto.',
    descriptionEn: 'Advanced colour techniques: balayage, highlights, tints and everything you need for the perfect blonde.',
    order: 2,
  },
  {
    slug: 'tratamientos',
    nameEs: 'Tratamientos',
    nameEn: 'Treatments',
    descriptionEs: 'Tratamientos capilares con productos GOA Organics para cabellos más sanos y brillantes.',
    descriptionEn: 'Hair treatments with GOA Organics products for healthier, shinier hair.',
    order: 3,
  },
  {
    slug: 'maquillaje',
    nameEs: 'Maquillaje y belleza',
    nameEn: 'Make-up & beauty',
    descriptionEs: 'Maquillaje profesional para cualquier ocasión, desde looks naturales hasta looks de noche.',
    descriptionEn: 'Professional make-up for any occasion, from natural everyday looks to evening glamour.',
    order: 4,
  },
  {
    slug: 'manicura',
    nameEs: 'Manicura',
    nameEn: 'Manicure',
    descriptionEs: 'Manicura y cuidado de uñas para manos perfectas.',
    descriptionEn: 'Manicure and nail care for perfect hands.',
    order: 5,
  },
  {
    slug: 'eventos',
    nameEs: 'Eventos especiales',
    nameEn: 'Special events',
    descriptionEs: 'Peinados, maquillaje y todo lo necesario para que brilles en tu día especial.',
    descriptionEn: 'Hair and make-up for weddings, celebrations and any special moment.',
    order: 6,
  },
]

async function seed() {
  console.log('Connecting to MongoDB…')
  await mongoose.connect(env.MONGODB_URI)

  let created = 0
  let skipped = 0

  for (const cat of CATEGORIES) {
    const existing = await GalleryCategory.findOne({ slug: cat.slug })
    if (existing) {
      console.log(`  skipped  ${cat.slug}`)
      skipped++
      continue
    }
    await GalleryCategory.create({ ...cat, active: true })
    console.log(`  created  ${cat.slug}`)
    created++
  }

  console.log(`\nDone - ${created} created, ${skipped} skipped (${CATEGORIES.length} total)`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
