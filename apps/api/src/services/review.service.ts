import { env } from '../config/env'
import { Review } from '../models/Review.model'
import type { GooglePlacesResponse, IReview, IReviewCreate } from '@falcanna/types'

const PLACES_API_URL = 'https://places.googleapis.com/v1/places'

/* ── Fetch reviews from Google Places API and sync to DB ── */
async function syncFromGoogle(): Promise<IReview[]> {
  const response = await fetch(`${PLACES_API_URL}/${env.PLACE_ID}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': env.GOOGLE_CONSOLE_API_KEY,
      'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews',
    },
  })

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as GooglePlacesResponse
  const googleReviews = data.reviews ?? []

  // Upsert each review (preserve selected/order if already exists)
  for (const gr of googleReviews) {
    await Review.findOneAndUpdate(
      { googleId: gr.name },
      {
        $setOnInsert: { selected: false, order: 0 },
        $set: {
          googleId:       gr.name,
          authorName:     gr.authorAttribution.displayName,
          authorPhotoUrl: gr.authorAttribution.photoUri ?? '',
          rating:         gr.rating,
          text:           gr.text.text,
          relativeTime:   gr.relativePublishTimeDescription,
          publishTime:    gr.publishTime,
        },
      },
      { upsert: true, new: true },
    )
  }

  return Review.find().sort({ order: 1, createdAt: -1 }).lean<IReview[]>()
}

/* ── List all reviews stored in DB ── */
async function getAll(): Promise<IReview[]> {
  return Review.find().sort({ order: 1, createdAt: -1 }).lean<IReview[]>()
}

/* ── List only selected reviews (public) ── */
async function getSelected(): Promise<IReview[]> {
  return Review.find({ selected: true }).sort({ order: 1 }).lean<IReview[]>()
}

/* ── Toggle selected + set order ── */
async function update(id: string, data: Partial<Pick<IReview, 'selected' | 'order'>>): Promise<IReview> {
  const review = await Review.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IReview>()
  if (!review) throw new Error('Review not found')
  return review
}

/* ── Create manual review ── */
async function create(data: IReviewCreate): Promise<IReview> {
  await Review.updateMany({}, { $inc: { order: 1 } })
  const review = await Review.create({
    googleId:       `manual_${Date.now()}`,
    source:         'manual',
    authorName:     data.authorName,
    authorPhotoUrl: data.authorPhotoUrl ?? '',
    rating:         data.rating,
    text:           data.text,
    relativeTime:   data.relativeTime ?? '',
    publishTime:    new Date().toISOString(),
    selected:       false,
    order:          0,
  })
  return review.toObject() as unknown as IReview
}

/* ── Swap order of two reviews ── */
async function reorder(id1: string, id2: string): Promise<void> {
  const [item1, item2] = await Promise.all([Review.findById(id1), Review.findById(id2)])
  if (!item1 || !item2) throw Object.assign(new Error('Review not found'), { statusCode: 404 })
  await Promise.all([
    Review.findByIdAndUpdate(id1, { order: item2.order }),
    Review.findByIdAndUpdate(id2, { order: item1.order }),
  ])
}

/* ── Bulk delete manual reviews ── */
async function bulkDelete(ids: string[]): Promise<void> {
  await Review.deleteMany({ _id: { $in: ids }, source: 'manual' })
}

/* ── Delete manual review ── */
async function remove(id: string): Promise<void> {
  const review = await Review.findById(id)
  if (!review) throw new Error('Review not found')
  if (review.source !== 'manual') throw new Error('Only manual reviews can be deleted')
  await Review.findByIdAndDelete(id)
}

export const reviewService = { syncFromGoogle, getAll, getSelected, update, create, reorder, bulkDelete, remove }
