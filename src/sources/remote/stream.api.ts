import { parseResponse } from '../utils'
import { backendApiWithAuth } from './api'
import {
  CreateStreamSchema,
  DeleteStreamSchema,
  GetStreamsSchema,
  UpdateStreamSchema,
} from './stream.type'

export const getStreams = async () => {
  const response = await backendApiWithAuth.get(`/stream`)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, GetStreamsSchema)
  return sanitizedBody
}

export const createStream = async (streamData: { url: string }) => {
  const response = await backendApiWithAuth.post(`/stream`, streamData)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, CreateStreamSchema)
  return sanitizedBody
}

export const updateStream = async (streamData: {
  id: string
  url?: string
}) => {
  const response = await backendApiWithAuth.patch(`/stream`, streamData)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, UpdateStreamSchema)
  return sanitizedBody
}

export const deleteStream = async (streamId: string) => {
  const response = await backendApiWithAuth.delete(`/stream/${streamId}`)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, DeleteStreamSchema)
  return sanitizedBody
}
