import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { CookiesProvider } from 'react-cookie'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// @ts-ignore ignore font import errors
import '@fontsource-variable/jetbrains-mono'
//  @ts-ignore ignore font import errors
import '@fontsource-variable/bitcount-prop-single'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { ThemeProvider } from './provider/theme-provider.tsx'
import { router } from './router.tsx'
import { Toaster } from './components/ui/sonner.tsx'

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <CookiesProvider>
        <ThemeProvider>
          <TanStackQueryProvider.Provider>
            <RouterProvider router={router} />
          </TanStackQueryProvider.Provider>
        </ThemeProvider>
      </CookiesProvider>
      <Toaster />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
