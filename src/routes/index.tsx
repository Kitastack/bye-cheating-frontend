import { Link, createFileRoute } from '@tanstack/react-router'
import { ByeCheatingLogo } from '@/components/byecheating-logo'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex grow flex-col items-center justify-center bg-accent">
      <ByeCheatingLogo />
      <Button asChild>
        <Link to="/login">Login Page</Link>
      </Button>
    </div>
  )
}
