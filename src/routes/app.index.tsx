import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import VideoPlayer from '@/components/video-player/video-player'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function VideoDisplay() {
  return (
    <section className="flex grow flex-col">
      <p className="font-bit">APPLICATION COMPONENT</p>
      <VideoPlayer className="aspect-video min-h-[400px] w-min" />
    </section>
  )
}

function Inspector() {
  return (
    <section className="flex min-w-72 flex-col gap-2">
      <p className="font-bit">Video Inspector</p>
      <Separator />
      <p>Stream Information</p>
      <p>created: {new Date().toDateString()}</p>
    </section>
  )
}

function RouteComponent() {
  return (
    <div className="flex h-full w-full grow gap-4">
      <VideoDisplay />
      <Separator className="shrink" orientation="vertical" />
      <Inspector />
    </div>
  )
}
