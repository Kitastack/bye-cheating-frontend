import * as z from 'zod/mini'

const ImageStreamingSchema = z.object({
  status: z.boolean(),
  /** `base64` image string */
  result: z.nullish(z.string()),
  /** prediction information. the availability is really depends on if the prediction is uses or not */
  prediction: z.nullish(
    z.array(
      z.object({
        track_id: z.string(),
        name: z.string(),
        confidence: z.number(),
      }),
    ),
  ),
})

/**
 * ImageStreamService class to handle image streaming functionality, including manage connections and streaming URLs.
 * This service can be extended to include methods for starting, stopping, and managing image streams.
 */
export class ImageStreamService {
  /** EventSource instance for handling server-sent events */
  private eventSource: EventSource | null = null
  /** URL for the image stream */
  streamUrl: string
  /** consume message information when `eventsource` is connected */
  messageCallback:
    | ((message: z.infer<typeof ImageStreamingSchema>) => void)
    | null = null
  /** consume error information when there's problem when `eventsource` is running.
   * you can update this to bind it with notification or logging for convenience */
  errorCallback: ((error: Error) => void) | null = null

  constructor(url: string) {
    // super('ImageStreamService')
    this.streamUrl = url
  }

  startStream() {
    this.stopStream()
    this.eventSource = new EventSource(this.streamUrl)
    this.eventSource.onmessage = (event) => {
      if (!event.data) {
        return
      }
      const parsedData = ImageStreamingSchema.safeParse(JSON.parse(event.data))
      if (!parsedData.success) {
        console.error('Invalid data received from stream:', parsedData.error)
        return
      }
      this.messageCallback?.(parsedData.data)
    }
    this.eventSource.onerror = (error) => {
      console.error('Error in stream:', error)
      this.errorCallback?.(new Error('Stream error: ' + error))
      this.stopStream()
    }
  }
  stopStream() {
    if (!this.eventSource) {
      return
    }
    this.eventSource.close()
    this.eventSource = null
    console.log('Stream stopped.')
  }
  pauseStream() {
    if (!this.eventSource) {
      console.warn('No active stream to pause.')
      return
    }
    this.eventSource.close()
    console.log('Stream paused.')
  }
  resumeStream() {
    if (!this.eventSource) {
      this.startStream()
      console.log('Stream resumed.')
    } else {
      console.warn('Stream is already running, cannot resume.')
    }
  }
}
