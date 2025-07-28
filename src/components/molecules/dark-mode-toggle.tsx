import { ComputerIcon, MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useTheme } from '@/provider/theme-provider'

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()

  const resetToSystemTheme = () => {
    setTheme('system')
  }
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            onClick={resetToSystemTheme}
            size={'icon'}
          >
            <ComputerIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Use System Theme</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
            size={'icon'}
          >
            <SunIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Light Mode</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
            size={'icon'}
          >
            <MoonIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Dark Mode</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
