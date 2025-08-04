import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { user } from '@/sources/remote/api'
import { DashboardLayout } from '@/layout/dashboard-layout'

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ location }) => {
    try {
      const response = await user.getUser()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error('Unauthorized access', {
          description: 'You need to log in to access this page.',
        })
        // redirect to login page
        throw redirect({ to: '/login', search: { redirect: location.href } })
      }
      throw error as Error
    }
  },
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <div className="flex h-full items-center justify-center">
      <p className="text-red-500">Error: {error.message}</p>
    </div>
  ),

  pendingComponent: () => (
    <div className="flex h-full items-center justify-center">Loading...</div>
  ),
  notFoundComponent: () => (
    <div className="flex items-center justify-center flex-col w-full h-full grow">
      <code className="text-2xl">404</code>
      <p>Not Found, please back to previous page</p>
    </div>
  ),
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
