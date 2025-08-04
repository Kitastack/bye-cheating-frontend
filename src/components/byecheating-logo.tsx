import { cn } from '@/lib/utils'

export function ByeCheatingLogo({ className }: { className?: string }) {
  return (
    <div className={cn('h-fit w-fit', className)}>
      <h1 className="text-bold m-0 font-bit">ByeCheating</h1>
    </div>
  )
}
