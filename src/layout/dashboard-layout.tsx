import { Book, Home, Users } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
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
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation()
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="flex grow flex-col">
        <header className="flex h-16 gap-4 p-4">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <code className='uppercase text-muted-foreground'>{location.pathname}</code>
        </header>
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

function DashboardSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center rounded transition-colors">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size={'lg'}
              className="cursor-pointer rounded-none"
            >
              <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
                <p className="size-4 font-bit text-sm">BC</p>
              </div>
              <div className="flex items-center gap-2 text-left leading-tight">
                <ByeCheatingLogo className='overflow-hidden' />
                <code className="text-sm text-muted-foreground">/ USER</code>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
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
