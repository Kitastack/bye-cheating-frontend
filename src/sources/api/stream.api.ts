import { StorageService } from '../local/storage-service'
import {
  CreateStreamSchema,
  DeleteStreamSchema,
  GetStreamsSchema,
  UpdateStreamSchema,
} from './stream.type'
import { BACKEND_URL } from '@/lib/constant'

export const getStreams = async () => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/stream`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const body = await response.json()
  const sanitizedBody = GetStreamsSchema.parse(body)
  return sanitizedBody
}

export const createStream = async (streamData: { url: string }) => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(streamData),
  })
  const body = await response.json()
  const sanitizedBody = CreateStreamSchema.parse(body)
  return sanitizedBody
}

export const updateStream = async (streamData: {
  id: string
  url?: string
}) => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/stream`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(streamData),
  })
  const body = await response.json()
  const sanitizedBody = UpdateStreamSchema.parse(body)
  return sanitizedBody
}

export const deleteStream = async (streamId: string) => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/stream/${streamId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const body = await response.json()
  const sanitizedBody = DeleteStreamSchema.parse(body)
  return sanitizedBody
}
