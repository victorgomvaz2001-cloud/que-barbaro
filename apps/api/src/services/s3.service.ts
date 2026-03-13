import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from '../config/s3'
import { env } from '../config/env'

export class S3Service {
  async getPresignedUrl(fileName: string, fileType: string, folder = 'uploads') {
    const key = `${folder}/${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    })

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })
    const fileUrl = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`

    return { uploadUrl, fileUrl, key }
  }

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    })
    await s3Client.send(command)
  }
}

export const s3Service = new S3Service()
