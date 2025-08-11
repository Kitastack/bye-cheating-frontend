import * as z from 'zod/mini'

const ImageStreamSourceSchema = z.object({
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
  message: z.nullish(z.string()),
})

/**
 * ImageStreamService class to handle image streaming source.
 *
 * information is passed using callback, and the connection state can be controlled by calling the method from this class
 */
export class ImageStreamService {
  /** EventSource instance for handling server-sent events */
  private eventSource: EventSource | null = null
  /** URL for the image stream */
  streamUrl: string
  streamUrlWithML: string
  prediction: boolean
  /** consume message information when `eventsource` is connected */
  messageCallback:
    | ((message: z.infer<typeof ImageStreamSourceSchema>) => void)
    | null = null
  /** consume error information when there's problem when `eventsource` is running.
   * you can update this to bind it with notification or logging for convenience */
  errorCallback: ((error: Error) => void) | null = null

  constructor(urlWithoutQueries: string) {
    // super('ImageStreamService')
    this.streamUrl = `${urlWithoutQueries}?json=true`
    this.streamUrlWithML = `${urlWithoutQueries}?json=true&prediction=true`
    this.prediction = false
  }

  startStream() {
    this.stopStream()
    this.eventSource = new EventSource(
      this.prediction ? this.streamUrlWithML : this.streamUrl,
    )
    this.eventSource.onmessage = (event) => {
      if (!event.data) {
        return
      }
      const parsedData = ImageStreamSourceSchema.safeParse(
        JSON.parse(event.data),
      )
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
  togglePrediction() {
    this.prediction = !this.prediction
  }
  togglePredictionAndReload() {
    this.togglePrediction()
    this.startStream()
  }
}
