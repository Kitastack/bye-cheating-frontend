import { Book, Home, Users } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'
import { ByeCheatingLogo } from '@/components/byecheating-logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { user } from '@/sources/remote'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DarkModeToggle } from '@/components/molecules/dark-mode-toggle'

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation()
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="flex grow flex-col">
        <header className="flex h-16 items-center justify-between gap-4 p-4">
          <section className="flex h-full items-center gap-4">
            <SidebarTrigger />
            <Separator orientation="vertical" />
            <code className="text-muted-foreground uppercase">
              {location.pathname}
            </code>
          </section>
          <DarkModeToggle />
        </header>
        <Separator orientation="horizontal" />
        <main className="grow p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

const sidebarItems = [
  { title: 'Live Cam', url: '/app', icon: Home },
  { title: 'Report View', url: '/app/report', icon: Book },
  { title: 'User Management', url: '/app/users', icon: Users },
]

function DashboardSidebarHeaderDropdownMenu({
  children,
}: {
  children: ReactNode
}) {
  const { isMobile } = useSidebar()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? 'bottom' : 'right'}
        sideOffset={4}
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-none"
      >
        <DropdownMenuLabel className="font-jetbrains text-muted-foreground uppercase">
          Account
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/app/profile">User Profile</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DashboardSidebarHeader() {
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('user')
  const getUser = async () => {
    try {
      const userData = await user.getUser()
      if (userData.result && userData.result.roles.length > 0) {
        setRole(userData.result.roles[0])
      }
    } catch (e) {
      toast.error('Error fetch data')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getUser()
  }, [])

  const loadingComponent = () => (
    <>
      <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
        <Skeleton className="size-4 font-bit text-sm" />
      </div>
      <div className="flex items-center gap-2 text-left leading-tight">
        <Skeleton className="h-4 w-full" />
      </div>
    </>
  )

  return (
    <SidebarHeader className="flex items-center justify-center rounded transition-colors h-16">
      <SidebarMenu>
        <SidebarMenuItem>
          <DashboardSidebarHeaderDropdownMenu>
            <SidebarMenuButton
              size={'lg'}
              className="cursor-pointer rounded-none"
            >
              {loading ? (
                loadingComponent()
              ) : (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
                    <p className="size-4 font-bit text-sm">BC</p>
                  </div>
                  <div className="flex items-center gap-2 text-left leading-tight">
                    <ByeCheatingLogo className="overflow-hidden" />
                    <code className="text-sm text-muted-foreground">
                      / {role.toUpperCase()}
                    </code>
                  </div>
                </>
              )}
            </SidebarMenuButton>
          </DashboardSidebarHeaderDropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

function DashboardSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarSeparator/>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarItems.map((value) => (
              <SidebarMenuItem key={value.title}>
                <SidebarMenuButton className="rounded-none" asChild>
                  <Link to={value.url}>
                    <value.icon />
                    <span>{value.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
