import { createFileRoute } from '@tanstack/react-router'
import { PauseIcon, PlayIcon } from 'lucide-react'
import VideoPlayer from '@/components/video-player/video-player'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const Route = createFileRoute('/dev')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <VideoPlayer
        className="w-4xl"
        bottomComponent={
          <section className="flex gap-2 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={'icon'} variant={'default'}>
                  <PlayIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Play stream</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={'icon'} variant={'outline'}>
                  <PauseIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pause stream</p>
              </TooltipContent>
            </Tooltip>
          </section>
        }
      />
    </div>
  )
}
