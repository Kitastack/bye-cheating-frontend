import { StorageService } from '../local/storage-service'
import { GetStreamingSchema } from './watch.type'
/**
 * main function to get the streaming data from a live session
 * @param liveId {string} - The ID of the live session to fetch streaming data for
 * @returns {Promise<z.infer<typeof GetStreamingSchema>>} - The streaming data for the live session
 */
export const getWatchStreaming = async (liveId: string) => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`/watch/live/${liveId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  const body = await response.json()
  const sanitizedBody = GetStreamingSchema.parse(body)
  return sanitizedBody
}

export const extendAMinuteAndGetStreaming = async (liveId: string) => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`/watch/live/${liveId}/extend-more-minutes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  const body = await response.json()
  const sanitizedBody = GetStreamingSchema.parse(body)
  return sanitizedBody
}
