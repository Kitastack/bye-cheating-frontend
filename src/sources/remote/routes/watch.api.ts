import { parseResponse } from '../../utils'
import { GetStreamingSchema } from '../types/watch.api'
import { backendApiWithAuth, streamApiWithAuth } from '..'
/**
 * main function to get the streaming data from a live session
 * @param liveId {string} - The ID of the live session to fetch streaming data for
 */
export const getWatchStreaming = async (liveId: string) => {
  const response = await streamApiWithAuth.get(`/watch/live/${liveId}`, {
    responseType: 'stream',
  })
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, GetStreamingSchema)
  return sanitizedBody
}

export const extendAMinuteAndGetStreaming = async (liveId: string) => {
  const response = await streamApiWithAuth.get(
    `/watch/live/${liveId}/extend-more-minutes`,
  )
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, GetStreamingSchema)
  return sanitizedBody
}
