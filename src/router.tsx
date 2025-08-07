import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
  },
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 1_000,
})
