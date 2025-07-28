import { cn } from '@/lib/utils'

export function ByeCheatingLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <h1 className="text-bold font-bit">Bye Cheating</h1>
    </div>
  )
}
