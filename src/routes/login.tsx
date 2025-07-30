import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ByeCheatingLogo } from '@/components/byecheating-logo'
import { DarkModeToggle } from '@/components/molecules/dark-mode-toggle'
import { PasswordInput } from '@/components/ui/password-input'
import { runApi, user } from '@/sources/api'
import { router } from '@/router'

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})

function LoginForm({ className }: { className?: string }) {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      const result = await runApi(() =>
        user.loginUser({
          email: values.value.email,
          password: values.value.password,
        }),
      )
      console.log('Login result:', result.success)
      if (result.success) {
        router.navigate({ to: '/app' })
      } else {
        console.error('Login failed:', result.message || 'Unknown error')
        toast('Login Failed', {
          description: result.message || 'Unknown error',
        })
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
        <section className="fixed hidden bg-slate-100 transition-colors md:relative md:flex md:items-center md:justify-center dark:bg-neutral-900">
          <p>Text here</p>
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
