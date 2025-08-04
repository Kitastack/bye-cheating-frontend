import { Book, Home, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ByeCheatingLogo } from '@/components/byecheating-logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className='flex grow flex-col'>
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
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center rounded transition-colors hover:bg-accent">
        <section className="flex gap-1">
          <ByeCheatingLogo />
          <code className="text-sm text-muted-foreground">/ USER MODE</code>
        </section>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((value) => (
                <SidebarMenuItem key={value.title}>
                  <SidebarMenuButton asChild>
                    <Link to={value.url}>
                      <value.icon />
                      <span>{value.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
