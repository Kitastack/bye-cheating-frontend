import { cn } from '@/lib/utils'

export function Loading({
  className,
  children,
}: {
  children?: React.ReactNode
  className?: string
}) {
  const childrenComponent = children ?? <p> Loading... </p>

  return (
    <div
      className={cn(
        'w-full, flex h-full grow flex-col items-center justify-center bg-transparent',
        className,
      )}
    >
      {childrenComponent}
    </div>
  )
}
