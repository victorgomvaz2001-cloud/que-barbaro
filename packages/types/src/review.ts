export interface IReview {
  _id: string
  googleId: string          // "places/PLACE_ID/reviews/REVIEW_ID" | "manual" for manual entries
  source: 'google' | 'manual'
  authorName: string
  authorPhotoUrl: string
  rating: number
  text: string
  relativeTime: string
  publishTime: string
  selected: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export type IReviewUpdate = Pick<IReview, 'selected' | 'order'>

export interface IReviewCreate {
  authorName: string
  authorPhotoUrl?: string
  rating: number
  text: string
  relativeTime?: string
}

// Shape returned by Google Places API v1
export interface GoogleReview {
  name: string
  relativePublishTimeDescription: string
  rating: number
  text: { text: string; languageCode: string }
  authorAttribution: {
    displayName: string
    uri: string
    photoUri: string
  }
  publishTime: string
}

export interface GooglePlacesResponse {
  displayName: { text: string }
  rating: number
  userRatingCount: number
  reviews: GoogleReview[]
}
