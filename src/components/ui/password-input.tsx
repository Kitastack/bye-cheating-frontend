import * as React from 'react'

import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export function PasswordInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  const [visible, setVisible] = React.useState(false)
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        data-slot="input"
        className={cn(
          'flex h-9 w-full min-w-0 rounded-none border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          className,
        )}
        {...props}
      />
      <span className="absolute top-0 right-0 text-sm text-muted-foreground">
        <Button
          type="button"
          variant="link"
          size="icon"
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeIcon /> : <EyeClosedIcon />}
        </Button>
      </span>
    </div>
  )
}
