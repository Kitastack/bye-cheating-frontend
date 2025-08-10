import { Card, CardContent } from '../ui/card'
import { calculateTimesRemaining, cn } from '@/lib/utils'

export function LiveCard({
  createdDate,
  id,
  expiryTimeInMinutes,
  path,
  streamId,
  className,
}: {
  id: string
  path: string
  streamId: string
  createdDate: string
  expiryTimeInMinutes: number
  className?: string
}) {
  const remainingTimestamp = calculateTimesRemaining(expiryTimeInMinutes)
  return (
    <Card className={cn('rounded-none p-3', className)}>
      <CardContent className="p-0">
        <div className="grid grid-flow-col grid-rows-2 gap-x-2">
          <p className="text-muted-foreground">Live ID:</p>
          <code className="max-w-16 overflow-hidden text-nowrap text-ellipsis">
            {id}
          </code>
          <p className="text-muted-foreground">Stream ID:</p>
          <code className="max-w-16 overflow-hidden text-nowrap text-ellipsis">
            {streamId}
          </code>
        </div>
        <div>
          <p className="text-muted-foreground">Created Date:</p>
          <p className="max-w-16 overflow-hidden text-nowrap">{createdDate}</p>
          <p className="text-muted-foreground">Expirity Time remaining:</p>
          <p className="overflow-hidden text-nowrap">
            {remainingTimestamp < 0 ? 0 : remainingTimestamp}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
