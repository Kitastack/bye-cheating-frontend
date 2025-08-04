import { parseResponse } from '../utils'
import { backendApiWithAuth } from './api'
import { GetStreamingSchema } from './watch.type'
/**
 * main function to get the streaming data from a live session
 * @param liveId {string} - The ID of the live session to fetch streaming data for
 */
export const getWatchStreaming = async (liveId: string) => {
  const response = await backendApiWithAuth.get(`/watch/live/${liveId}`)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, GetStreamingSchema)
  return sanitizedBody
}

export const extendAMinuteAndGetStreaming = async (liveId: string) => {
  const response = await backendApiWithAuth.post(
    `/watch/live/${liveId}/extend-more-minutes`,
    { extendMoreMinutes: 5 },
  )
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, GetStreamingSchema)
  return sanitizedBody
}
