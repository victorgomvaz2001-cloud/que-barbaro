export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiListResponse<T> {
  data: T[]
  total: number
  page?: number
  limit?: number
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

export interface AuthTokenPayload {
  userId: string
  email: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    _id: string
    email: string
    name: string
    role: string
  }
}

export interface PresignedUrlRequest {
  fileName: string
  fileType: string
  folder?: string
}

export interface PresignedUrlResponse {
  uploadUrl: string
  fileUrl: string
  key: string
}

export interface IMediaItem {
  key: string
  url: string
  size: number
  lastModified: string
}
