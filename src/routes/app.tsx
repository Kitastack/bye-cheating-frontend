import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { user } from '@/sources/remote'
import { DashboardLayout } from '@/layout/dashboard-layout'
import { StorageService } from '@/sources/local/storage-service'

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ location }) => {
    const isAuthenticated = StorageService.getIsAuthenticated()
    console.log('authenticated? ', isAuthenticated)
    if (isAuthenticated) return
    try {
      await user.getUser()
      StorageService.setIsAuthenticated(true)
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
    <div className="flex h-full w-full grow flex-col items-center justify-center">
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
