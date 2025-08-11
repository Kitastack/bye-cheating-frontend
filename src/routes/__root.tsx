import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import type { QueryClient } from '@tanstack/react-query'
import TanStackQueryLayout from '@/integrations/tanstack-query/layout'
import { ImageStreamingProvider } from '@/provider/image-streaming-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        title: 'Bye Cheating - App',
      },
      {
        name: 'description',
        content: 'CCTV Camera Management powered by AI',
      },
    ],
  }),
  component: () => (
    <>
      <ImageStreamingProvider>
        <HeadContent />
        <Outlet />
        <TanStackRouterDevtools />
        <TanStackQueryLayout />
      </ImageStreamingProvider>
    </>
  ),
})
