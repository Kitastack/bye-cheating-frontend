import { createFileRoute } from '@tanstack/react-router'
import { PlayIcon, RefreshCwIcon, SquareIcon } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import type { PredictionStream } from '@/services/image-stream-service'
import { Separator } from '@/components/ui/separator'
import VideoPlayer from '@/components/video-player/video-player'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { stream } from '@/sources/remote'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StreamCard } from '@/components/molecules/stream-card'
import { Loading } from '@/components/molecules/loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useImageStreaming } from '@/provider/image-streaming-provider'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function VideoDisplay() {
  const { streamService, extendLiveStreamInOneMinutes, streamInfo } =
    useImageStreaming()
  const [base64, setBase64] = useState('')
  const [message, setMessage] = useState('')
  const [predictionData, setPredictionData] = useState<PredictionStream>([])
  const [connectionStatus, setConnectionStatus] = useState('idle')
  useEffect(() => {
    if (streamService) {
      streamService.messageCallback = (msg) => {
        setBase64(msg.result ?? '')
        setMessage(msg.prediction?.toString() ?? '')
      }
      streamService.predictionCallback = (prediction) => {
        setPredictionData(prediction)
      }
      streamService.statusCallback = (status) => {
        setConnectionStatus(status)
      }
      console.log(streamService.streamUrl)
    }
  }, [streamService])

  return (
    <section className="flex grow flex-col">
      <VideoPlayer
        className="h-[90%] w-[100%]"
        base64Img={base64}
        topLeftComponent={
          <section
            data-is-set={streamInfo != undefined}
            className="flex gap-2 p-1 text-xs text-white data-[is-set=true]:bg-primary data-[is-set=true]:text-primary-foreground"
          >
            <p>Current Live ID: </p>
            <code>{streamInfo?.liveId ?? 'Not set'}</code>
          </section>
        }
        topRightComponent={
          <section className="flex gap-2 text-xs text-white">
            Detection: {predictionData.length}
          </section>
        }
        bottomComponent={
          <section className="flex flex-col p-2">
            <div></div>
            <div className="flex justify-between">
              <section className="flex gap-2">
                <Button
                  onClick={() => streamService?.startStream()}
                  variant={'default'}
                  size={'icon'}
                  disabled={streamService === undefined}
                >
                  <PlayIcon />
                </Button>
                <Button
                  onClick={() => streamService?.stopStream()}
                  variant={'outline'}
                  size={'icon'}
                  disabled={streamService === undefined}
                >
                  <SquareIcon />
                </Button>
                <Button
                  onClick={() => extendLiveStreamInOneMinutes()}
                  variant={'outline'}
                  size={'icon'}
                  disabled={streamService === undefined}
                >
                  <RefreshCwIcon />
                </Button>
                <Separator orientation="vertical" />
                <code className="flex h-full items-center justify-center text-xs text-white">
                  connection {connectionStatus}
                </code>
              </section>
              <section className="flex items-center justify-center space-x-2 text-white">
                <Switch
                  onCheckedChange={(checked) =>
                    streamService?.setPredictionAndReload(checked)
                  }
                  id="prediction-mode"
                />{' '}
                <Label htmlFor="prediction-mode">Prediction Mode</Label>
              </section>
            </div>
          </section>
        }
      />
    </section>
  )
}

function Inspector() {
  const { streamInfo, streamService } = useImageStreaming()
  return (
    <section className="flex h-full min-w-72 flex-col gap-2">
      <div className="flex flex-col gap-4 text-xs">
        <div>
          <p className="text-muted-foreground">Live ID</p>
          <p>{streamInfo?.liveId ?? 'No information provided'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Stream ID</p>
          <p>{streamInfo?.streamId ?? 'No information provided'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Created At</p>
          <p>
            {streamInfo?.createdAt.toLocaleString() ??
              'No information provided'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Stream Socket Available</p>
          <p>{streamService ? 'Yes' : 'No'}</p>
        </div>
      </div>
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

  const { createLiveStream } = useImageStreaming()

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
                  key={val.id}
                  className="text-xs"
                  createdDate={new Date(val.createdDate).toLocaleString()}
                  id={val.id}
                  url={val.url}
                  onStreamClicked={(streamid) => {
                    console.log(streamid)
                    createLiveStream(streamid)
                  }}
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
        <TabsList className="rounded-none bg-transparent p-0 font-bit">
          <TabsTrigger
            className="rounded-none border-b-0 font-bit text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:underline data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
            value="streamlist"
          >
            Stream List
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border border-b-0 font-bit text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:underline data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
            value="inspector"
          >
            Video Player Inspector
          </TabsTrigger>
        </TabsList>
        <TabsContent value="streamlist" className="h-full">
          <StreamList />
        </TabsContent>
        <TabsContent value="inspector" className="h-full">
          <Inspector />
        </TabsContent>
      </Tabs>
      <Separator className="shrink" orientation="vertical" />
      <VideoDisplay />
    </div>
  )
}
