import { backendApiWithAuth } from '../api'
import { parseResponse } from '../utils'
import { CreateLiveSchema, GetLivesSchema, UpdateLiveSchema } from './live.type'

/**
 * get video lives
 *
 * this function will return differently between user and admin video lives, so keep that in mind.
 *
 * @returns
 */
export const getVideoLives = async () => {
  const response = await backendApiWithAuth.get(`/live`)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, GetLivesSchema)
  return sanitizedBody
}
/**
 * create a new video live.
 * when return value, use `result.url` to get the live url path
 * (remember to join it with base domain backend url).
 *
 * or, use `result.id` (live id) to get the live url path
 * from `URL/watch/live/{live id}` endpoint.
 * @param liveData.streamId stream id
 * @param liveData.expiryTimeInMinutes optional expiry time in minutes
 * @returns
 */
export const createVideoLive = async (liveData: {
  streamId: string
  expiryTimeInMinutes?: number
}) => {
  const response = await backendApiWithAuth.post(`/live`, liveData)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, CreateLiveSchema)
  return sanitizedBody
}

/**
 *  update video live.
 *
 *
 * @param liveData.id live id
 * @param liveData.expiryTimeInMinutes optional expiry time in minutes
 * @returns
 */
export const updateVideoLive = async (liveData: {
  id: string
  expiryTimeInMinutes?: number
}) => {
  const response = await backendApiWithAuth.patch(`/live`, liveData)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, UpdateLiveSchema)
  return sanitizedBody
}
