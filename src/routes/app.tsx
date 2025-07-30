import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { runApi, user } from '@/sources/api'
import { DashboardLayout } from '@/layout/dashboard-layout'

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ location }) => {
    try {
      const response = await runApi(() => user.getUser())
      if (response.success === false) throw new Error('User unauthorized')
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // redirect to login page
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
