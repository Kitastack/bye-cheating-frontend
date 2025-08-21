import React from 'react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { ImageStreamService } from '@/services/image-stream-service'
import { live, watch } from '@/sources/remote'
import { STREAM_URL } from '@/lib/constant'

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
  streamService?: ImageStreamService
  /** function to update the stream information */
  updateStreamInfo: (info: Partial<ImageStreamingInformation>) => void
  assignNewStreamingService: (newService: ImageStreamService) => void
  createLiveStream: (streamId: string) => Promise<void>
  extendLiveStreamInOneMinutes: () => Promise<void>
}

export const ImageStreamingContext = React.createContext<
  ImageStreamingContext | undefined
>(undefined)

export function ImageStreamingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const [streamInfo, setStreamInfo] = React.useState<
    ImageStreamingInformation | undefined
  >()
  const [streamService, setStreamService] = React.useState<
    ImageStreamService | undefined
  >(undefined)

  const updateStreamInfo = (newInfo: Partial<ImageStreamingInformation>) => {
    const finalInfo = {
      ...streamInfo,
      ...newInfo,
    } as ImageStreamingInformation
    setStreamInfo(finalInfo)
  }
  const assignNewStreamingService = (newService: ImageStreamService) => {
    setStreamService(newService)
  }

  const extendLiveStreamInOneMinutes = async () => {
    if (streamInfo) {
      try {
        const response = await watch.extendAMinuteAndGetStreaming(
          streamInfo.liveId,
        )
        if (response.success) {
          toast.success('Extend minute success')
        }
      } catch (error) {
        console.log('error for extending live stream: ', error)
        if (error instanceof AxiosError) {
          toast.error('Error when extend stream live', {
            description: error.message,
          })
          return
        }
        toast.error('Error when extend stream live')
      }
    }
  }

  const createLiveStream = async (streamId: string) => {
    console.log(streamId, ' assigned')
    try {
      const result = await live.createVideoLive({
        streamId: streamId,
        expiryTimeInMinutes: 7,
      })
      if (result.success) {
        toast.success(
          'Live Stream Created, assigning to current video player...',
        )
        if (!result.result) throw new Error('Path is empty, aborting...')
        setStreamInfo({
          createdAt: new Date(result.result.createdDate),
          expiresAt: result.result.expiryTimeInMinutes ?? 0,
          liveId: result.result.id,
          path: result.result.path,
          streamId: result.result.streamId,
        })
        setStreamService(
          new ImageStreamService(`${STREAM_URL}${result.result.path}`),
        )
        queryClient.invalidateQueries({ queryKey: ['getVideoLives'] })
      }
    } catch (error) {
      console.log('error for creating live stream: ', error)
      if (error instanceof AxiosError) {
        toast.error('Error when create stream live', {
          description: error.message,
        })
        return
      }
      toast.error('Error when create stream live')
    }
  }

  const value: ImageStreamingContext = {
    streamInfo: streamInfo,
    updateStreamInfo,
    streamService: streamService,
    assignNewStreamingService,
    createLiveStream,
    extendLiveStreamInOneMinutes,
  }

  return <ImageStreamingContext.Provider value={value}>{children}</ImageStreamingContext.Provider>
}
export function useImageStreaming() {
  const context = React.useContext(ImageStreamingContext)
  if (!context) {
    throw Error(
      'useImageStreaming must be called inside ImageStreamingProvider',
    )
  }
  return context
}
