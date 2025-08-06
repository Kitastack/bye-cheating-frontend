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
      <VideoPlayer className="min-h-[400px]" />
    </section>
  )
}

function RouteComponent() {
  return (
    <div className="flex h-full w-full grow">
      <VideoDisplay />
      <Separator className="shrink" orientation="vertical" />
      <section>right side</section>
    </div>
  )
}
