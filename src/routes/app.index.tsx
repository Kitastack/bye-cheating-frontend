import { createFileRoute } from '@tanstack/react-router'
import { RefreshCwIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import VideoPlayer from '@/components/video-player/video-player'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { live, stream } from '@/sources/remote'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StreamCard } from '@/components/molecules/stream-card'
import { Loading } from '@/components/molecules/loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

function LiveList() {
  const { status, data, error } = useQuery({
    queryKey: ['getLives'],
    queryFn: live.getVideoLives,
  })

  const filteredData = data?.result ?? []

  const returnComponent = () => {
    switch (status) {
      case 'error':
        return (
          <div className="flex h-full w-full grow items-center justify-center">
            Error occured: {error.message}
          </div>
        )
      case 'pending':
        return (
          <div className="h-full w-full grow">
            <Loading />
          </div>
        )
      case 'success':
        if (filteredData.length < 1) {
          return (
            <div className="flex h-full w-full grow items-center justify-center">
              Stream empty
            </div>
          )
        }
        return (
          <ScrollArea>
            {filteredData.map((val) => {
              return (
                <StreamCard id={val.id} url={val.streamId} createdDate={''} />
              )
            })}
          </ScrollArea>
        )
    }
  }

  return (
    <section className="flex h-full min-w-72 flex-col gap-2">
      <div className="flex"></div>
      <Separator />
      {returnComponent()}
    </section>
  )
}

function StreamList() {
  const { status, data, error } = useQuery({
    queryKey: ['getStreams'],
    queryFn: stream.getStreams,
  })
  const filteredData = data?.result ?? []

  const returnComponent = () => {
    switch (status) {
      case 'pending':
        return <Loading />
      case 'error':
        return (
          <div className="flex h-full w-full grow items-center justify-center">
            Error occured: {error.message}
          </div>
        )
      case 'success':
        if (filteredData.length < 1) {
          return (
            <div className="flex h-full w-full grow items-center justify-center">
              Stream empty
            </div>
          )
        }
        return (
          <ScrollArea>
            {filteredData.map((val, _) => {
              return (
                <StreamCard
                  className="text-xs"
                  createdDate={new Date(val.createdDate).toLocaleString()}
                  id={val.id}
                  url={val.url}
                />
              )
            })}
          </ScrollArea>
        )
    }
  }

  return (
    <section className="flex h-full min-w-72 flex-col gap-2">
      <div className="flex">
        <Input type="search" />
        <Button size={'icon'} variant={'ghost'}>
          <RefreshCwIcon />
        </Button>
      </div>
      <Separator />
      {returnComponent()}
    </section>
  )
}

function RouteComponent() {
  return (
    <div className="flex h-full w-full grow gap-4">
      <Tabs defaultValue="streamlist" className="h-full">
        <TabsList className="rounded-none bg-transparent">
          <TabsTrigger className="rounded-none font-bit" value="streamlist">
            Stream List
          </TabsTrigger>
          <TabsTrigger className="rounded-none font-bit" value="livelist">
            Live List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="streamlist" className="h-full">
          <StreamList />
        </TabsContent>
        <TabsContent value="livelist" className="h-full">
          <LiveList />
        </TabsContent>
      </Tabs>
      <Separator className="shrink" orientation="vertical" />
      <VideoDisplay />
    </div>
  )
}
