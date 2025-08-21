import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='flex flex-col grow'>Hello "/app/users"!</div>
}
