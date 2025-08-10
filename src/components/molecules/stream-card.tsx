import { useState } from 'react'
import {
  CassetteTapeIcon,
  CopyIcon,
  TrashIcon,
  TurntableIcon,
} from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { stream } from '@/sources/remote'
import { cn } from '@/lib/utils'

function DeleteStreamBtnDialog({ streamId }: { streamId: string }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      id: streamId,
    },
    onSubmit: async (props) => {
      try {
        const result = await stream.deleteStream(props.value.id)
        if (result.success) {
          toast.success('Stream URL has been deleted')
          setOpen(false)
          queryClient.invalidateQueries({ queryKey: ['getStreams'] })
        }
      } catch (e) {
        console.log(e)
        if (e instanceof AxiosError) {
          toast.error('Delete stream failed', { description: e.message })
          return
        }
        toast.error('Delete stream failed')
      }
    },
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'iconSm'} variant={'destructive'}>
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>Do you want to delete this stream URL?</DialogTitle>
            <DialogDescription>This action cannot be undone</DialogDescription>
          </DialogHeader>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <DialogFooter>
                <DialogClose type="button" asChild>
                  <Button
                    type="button"
                    variant={'outline'}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant={'destructive'}
                  type="submit"
                  disabled={!canSubmit}
                >
                  Delete Stream URL
                </Button>
              </DialogFooter>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function StreamCard({
  createdDate,
  id,
  url,
  className,
}: {
  createdDate: string
  id: string
  url: string
  className?: string
}) {
  return (
    <div
      className={cn('flex flex-col gap-2 rounded-none border p-3', className)}
    >
      <section className="flex flex-col gap-2 p-0">
        <div className="grid w-fit grid-flow-col grid-rows-2 gap-x-4">
          <p className="text-muted-foreground">Stream ID:</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <code className="max-w-16 overflow-hidden text-nowrap text-ellipsis">
                {id}
              </code>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-1 pl-1">
              <Button
                variant={'ghost'}
                size={'iconSm'}
                onClick={() => {
                  navigator.clipboard.writeText(id)
                  toast('Stream ID Copied')
                }}
              >
                <CopyIcon />
              </Button>
              <code>{id}</code>
            </TooltipContent>
          </Tooltip>
          <p className="text-muted-foreground">Date</p>
          <code>{createdDate}</code>
        </div>
        <div>
          <p className="text-muted-foreground">URL </p>
          <code>{url}</code>
        </div>
      </section>
      <Separator orientation="horizontal" />
      <div className="flex gap-2">
        <DeleteStreamBtnDialog streamId={id} />
        <Button variant={'ghost'} size={'sm'}>
          <p className="text-xs">Stream</p>
          <TurntableIcon />
        </Button>
        <Button variant={'ghost'} size={'sm'}>
          <p className="text-xs">Record</p>
          <CassetteTapeIcon />
        </Button>
      </div>
    </div>
  )
}
