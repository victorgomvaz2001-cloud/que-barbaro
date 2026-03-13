import type { Request, Response, NextFunction } from 'express'
import { s3Service } from '../services/s3.service'
import type { PresignedUrlRequest } from '@falcanna/types'

export async function getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileName, fileType, folder } = req.body as PresignedUrlRequest
    const result = await s3Service.getPresignedUrl(fileName, fileType, folder)
    res.json({ data: result })
  } catch (err) {
    next(err)
  }
}
