import { createFileRoute, useStableCallback } from '@tanstack/react-router'
import { RefreshCwIcon } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { Separator } from '@/components/ui/separator'
import VideoPlayer from '@/components/video-player/video-player'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { live, stream } from '@/sources/remote'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StreamCard } from '@/components/molecules/stream-card'
import { Loading } from '@/components/molecules/loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LiveCard } from '@/components/molecules/live-card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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
          <ScrollArea className="text-sm">
            {filteredData.map((val) => {
              return (
                <LiveCard
                  id={val.id}
                  path={val.path}
                  createdDate={new Date(val.createdDate).toLocaleDateString()}
                  expiryTimeInMinutes={val.expiryTimeInMinutes ?? 0}
                  streamId={val.streamId}
                />
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

function AddStreamBtnDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      streamUrl: '',
    },
    onSubmit: async (props) => {
      try {
        const result = await stream.createStream({ url: props.value.streamUrl })
        if (result.success) {
          toast.success('Stream url has been added to list')
          setOpen(false)
          queryClient.invalidateQueries({ queryKey: ['getStreams'] })
        }
      } catch (e) {
        console.error('Add Stream Error: ', e)
        if (e instanceof AxiosError) {
          toast.error(`Fail to add stream`, { description: e.message })
          return
        }
        toast.error('add stream failed. Please check the console log')
      }
    },
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          console.log('submit clicked')
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <DialogTrigger asChild>
          <Button>Add Stream</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Video Stream</DialogTitle>
            <DialogDescription>
              The supported links are only <code>rtsp://</code> url
            </DialogDescription>
          </DialogHeader>
          <div className="flex">
            <form.Field
              name="streamUrl"
              children={(field) => (
                <div className="flex w-full flex-col gap-2">
                  <Input
                    type="url"
                    placeholder="example: rtsp://host.docker.internal:8554/live"
                    required
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <p className="text-sm text-destructive-foreground">
                    {field.state.meta.errors.join(', ')}
                  </p>
                </div>
              )}
            />
          </div>
          <DialogFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  <DialogClose asChild>
                    <Button variant={'outline'} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    onClick={() => form.handleSubmit()}
                    disabled={!canSubmit}
                  >
                    Submit
                  </Button>
                </>
              )}
            />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
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
        <AddStreamBtnDialog />
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
        <TabsList className="rounded-none bg-transparent font-bit">
          <TabsTrigger
            className="rounded-none border-none font-bit data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
            value="streamlist"
          >
            Stream List
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-none font-bit data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
            value="livelist"
          >
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
