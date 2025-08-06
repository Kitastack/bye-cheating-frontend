import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { AlertCircleIcon, CircleCheckIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ByeCheatingLogo } from '@/components/byecheating-logo'
import { DarkModeToggle } from '@/components/molecules/dark-mode-toggle'
import { PasswordInput } from '@/components/ui/password-input'
import { backendApi, user } from '@/sources/remote'
import { router } from '@/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})

function BackendStatusMeter({ className }: { className?: string }) {
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'loading' | 'disconnected' | 'error' | 'unknown'
  >('disconnected')
  const [statusCode, setStatusCode] = useState(0)

  const pingServer = async () => {
    try {
      const result = await backendApi.get('/ping')
      if (result.status) {
        setConnectionStatus('connected')
        setStatusCode(result.status)
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        if (!e.response) {
          setConnectionStatus('error')
          return
        }
        setConnectionStatus('error')
        setStatusCode(e.response.status)
        return
      }
      setConnectionStatus('unknown')
      setStatusCode(0)
    }
  }
  useEffect(() => {
    pingServer()
    const intervalId = setInterval(() => {
      pingServer()
    }, 10000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <Card className={cn('rounded-none shadow-none', className)}>
      <CardHeader>
        <CardTitle>Backend Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <p>Backend URL</p>
          <code>{import.meta.env.VITE_BACKEND_URL ?? 'unknown'}</code>
          <p>Status</p>
          <code className="flex gap-2 uppercase">
            {' '}
            {connectionStatus === 'connected' ? (
              <CircleCheckIcon className="text-green-300 dark:text-green-400" />
            ) : (
              <AlertCircleIcon className="text-yellow-500 dark:text-yellow-300" />
            )}{' '}
            {connectionStatus}
          </code>
          <p>Code</p>
          <code>{statusCode}</code>
        </div>
      </CardContent>
    </Card>
  )
}

function LoginForm({ className }: { className?: string }) {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const result = await user.loginUser({
          email: values.value.email,
          password: values.value.password,
        })
        if (result.success) {
          toast.success('Login successful!')
          router.navigate({ to: '/app' })
        }
      } catch (error) {
        console.error('Login error:', error)
        if (error instanceof AxiosError) {
          toast.error(`Login failed`, { description: error.message })
          return
        }
        toast.error('Login failed. Please check your credentials.')
      }
    },
  })

  return (
    <form
      className={cn('flex w-full max-w-md flex-col gap-4', className)}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return 'Email is required'
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Invalid email format'
            }
            return undefined
          },
        }}
        children={(field) => (
          <div className="flex flex-col gap-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              required
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <p className="text-sm text-destructive-foreground">
              {field.state.meta.errors.join(', ')}
            </p>
          </div>
        )}
      />
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return 'Password is required'
            }
            if (value.length < 6) {
              return 'Password must be at least 6 characters long'
            }
            return undefined
          },
        }}
        children={(field) => {
          return (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Password</Label>
              <PasswordInput
                placeholder="Enter your password"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <p className="text-sm text-destructive-foreground">
                {field.state.meta.errors.join(', ')}
              </p>
            </div>
          )
        }}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            variant={'default'}
            disabled={!canSubmit}
            type="submit"
            className="w-full"
          >
            {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
          </Button>
        )}
      />
    </form>
  )
}

function LoginComponent() {
  return (
    <>
      <nav className="fixed top-0 right-0 z-50 m-8 flex items-center justify-end gap-4">
        <ByeCheatingLogo className="text-2xl" />
        <DarkModeToggle />
      </nav>
      <div className="grid grow grid-cols-1 md:grid-cols-2">
        <section className="fixed bg-slate-100 transition-colors md:relative md:flex md:items-center md:justify-center dark:bg-neutral-900">
          <BackendStatusMeter />
        </section>
        <section className="relative flex flex-col items-center justify-center gap-8 border-l-2 bg-background p-8 transition-colors">
          <div className="flex max-w-md grow flex-col items-center justify-center gap-2">
            <p className="mb-4 font-jetbrains text-lg font-semibold">
              LOGIN PAGE
            </p>
            <p className="mb-4 w-full">
              Enter from below to continue to application
            </p>
            <LoginForm />
            <div className="my-2 w-full border border-dashed bg-black"></div>
            <section className="text-sm text-muted-foreground">
              <p>
                Information: Account can only be created by the admin to limit
                the access to the camera. please contact the admin to create an
                account for you.
              </p>
            </section>
          </div>
        </section>
      </div>
    </>
  )
}
