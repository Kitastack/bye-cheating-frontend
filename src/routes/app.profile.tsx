import { createFileRoute } from '@tanstack/react-router'
import { user } from '@/sources/remote'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/app/profile')({
  component: RouteComponent,
  loader: () => user.getUser(),
})

function RouteComponent() {
  const userData = Route.useLoaderData()
  const logout = () => {
    user.logoutUser()
  }
  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="font-bit text-3xl">{'>'} User Profile</h1>
      <p>{userData.result?.name}</p>
      <p>{userData.result?.email}</p>
      <Button onClick={logout}>Logout?</Button>
    </div>
  )
}
