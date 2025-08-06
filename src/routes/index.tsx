import { createFileRoute } from '@tanstack/react-router'
import { ByeCheatingLogo } from '@/components/byecheating-logo'
import { Button } from '@/components/ui/button'
import { user } from '@/sources/remote'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  async function handleTestError() {
    const result = await user.getUser()
    console.log('User fetched successfully', result.responseCode)
  }
  return (
    <div className="flex grow flex-col items-center justify-center bg-accent">
      <ByeCheatingLogo />
      {/* <Button asChild>
        <Link to="/login">Login Page</Link>
      </Button> */}
      <Button onClick={handleTestError}>Test error api</Button>
    </div>
  )
}
