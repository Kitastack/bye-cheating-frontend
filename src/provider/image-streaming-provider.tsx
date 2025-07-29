import React from 'react'
import { ImageStreamService } from '@/services/image-stream-service'

export interface ImageStreamingInformation {
  /** stream id  */
  streamId: string
  /** live id if you have any  */
  liveId: string
  /** stream path, like `/watch/live/{liveId}` */
  path: string
  /** stream created date, based on DateTime */
  createdAt: Date
  /** expirity time in epoch minutes */
  expiresAt: number
}

export interface ImageStreamingContext {
  /** information about the stream */
  streamInfo?: ImageStreamingInformation
  /** the current streaming service */
  streamService: ImageStreamService
  /** function to update the stream information */
  updateStreamInfo: (info: Partial<ImageStreamingInformation>) => void
  assignNewStreamingService: (newService: ImageStreamService) => void
}

const initialContext: ImageStreamingContext = {
  streamService: new ImageStreamService(''),
  updateStreamInfo: () => {},
  assignNewStreamingService: () => {},
}

export const ImageStreamingContext =
  React.createContext<ImageStreamingContext>(initialContext)

export function ImageStreamingProvider({
  children,
}: {
  children: React.ReactNode
  value: ImageStreamingContext
}) {
  const [streamInfo, setStreamInfo] = React.useState<
    ImageStreamingInformation | undefined
  >(initialContext.streamInfo)
  const streamService = React.useRef(initialContext.streamService)

  const updateStreamInfo = (newInfo: Partial<ImageStreamingInformation>) => {
    const finalInfo = {
      ...streamInfo,
      ...newInfo,
    } as ImageStreamingInformation
    setStreamInfo(finalInfo)
  }
  const assignNewStreamingService = (newService: ImageStreamService) => {
    streamService.current = newService
  }

  const finalValue: ImageStreamingContext = {
    streamInfo: streamInfo,
    updateStreamInfo,
    streamService: streamService.current,
    assignNewStreamingService,
  }

  return (
    <ImageStreamingContext.Provider value={finalValue}>
      {children}
    </ImageStreamingContext.Provider>
  )
}
export function useImageStreaming() {
  const context = React.useContext(ImageStreamingContext)

  return context
}
