import { CopyIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import type { StreamSchema } from '@/sources/remote/types/stream.api'
import type { z } from 'zod/mini'
import { cn } from '@/lib/utils'

type StreamData = z.infer<typeof StreamSchema>

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
    <Card className={cn('rounded-none p-3', className)}>
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="grid w-fit grid-flow-col grid-rows-2 gap-x-4">
          <p className="text-muted-foreground">Stream ID:</p>
          <code className="max-w-16 overflow-hidden text-nowrap text-ellipsis">
            {id}
          </code>
          <p className="text-muted-foreground">Date</p>
          <code>{createdDate}</code>
        </div>
        <div>
          <p className="text-muted-foreground">URL </p>
          <code>{url}</code>
        </div>
      </CardContent>
    </Card>
  )
}
