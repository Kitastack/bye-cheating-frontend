import { createFileRoute } from '@tanstack/react-router'
import { StreamCard } from '@/components/molecules/stream-card'

export const Route = createFileRoute('/dev')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <p>Stream List</p>
      <div>

      <StreamCard
        createdDate="08-02-2003"
        id="dakfjlakfjiealk"
        url="rtsp://localhost:8554/live"
      />
      <StreamCard
        createdDate="08-02-2022"
        id="pnoibpcounmpvnm"
        url="rtsp://localhost:8554/live"
      />
      </div>
    </div>
  )
}
