import { StorageService } from '../local/storage-service'
import { CreateLiveSchema, GetLivesSchema, UpdateLiveSchema } from './live.type'
import { BACKEND_URL } from '@/lib/constant'

/**
 * get video lives
 *
 * this function will return differently between user and admin video lives, so keep that in mind.
 *
 * @returns
 */
export const getVideoLives = async () => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/live`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const body = await response.json()
  const sanitizedBody = GetLivesSchema.parse(body)
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
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/live`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(liveData),
  })
  const body = await response.json()
  const sanitizedBody = CreateLiveSchema.parse(body)
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
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/live`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(liveData),
  })
  const body = await response.json()
  const sanitizedBody = UpdateLiveSchema.parse(body)
  return sanitizedBody
}
