import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ImageStreamingPlayerProps {
  topLeftComponent?: ReactNode
  topRightComponent?: ReactNode
  bottomComponent?: ReactNode
  /** base64 image sring, including teh image type */
  base64Img?: string
  className?: string
}

export default function VideoPlayer({
  topLeftComponent,
  topRightComponent,
  bottomComponent,
  base64Img,
  className,
}: ImageStreamingPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const syncCanvasSize = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }

  const renderFrame = async (base64: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    try {
      const dataUrl = base64
      const response = await fetch(dataUrl)
      const imageBlob = await response.blob()
      const imageBitmap = await createImageBitmap(imageBlob)

      syncCanvasSize()

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)
      imageBitmap.close()
    } catch (error) {
      console.error(`Failed to render frame:`, error)
    }
  }

  useEffect(() => {
    if (!base64Img) return
    renderFrame(base64Img)
  }, [base64Img, renderFrame])

  return (
    <div
      className={cn(
        'relative flex aspect-video items-center justify-center border border-foreground shadow-lg',
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        inputMode="url"
        className="h-full w-full grow bg-accent"
      />
      <section className="absolute top-0 left-0 m-2">
        {topLeftComponent}
      </section>
      <section className="absolute top-0 right-0 m-2">
        {topRightComponent}
      </section>
      <section className="absolute bottom-0 w-full">{bottomComponent}</section>
    </div>
  )
}
