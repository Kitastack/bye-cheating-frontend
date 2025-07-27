import { createFileRoute } from '@tanstack/react-router'
import { ByeCheating } from '@/components/byecheating-logo'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex grow flex-col items-center justify-center bg-accent">
      <ByeCheating />
      <Button asChild>
        <a href="http://google.com">Go to Google</a>
      </Button>
    </div>
  )
}
