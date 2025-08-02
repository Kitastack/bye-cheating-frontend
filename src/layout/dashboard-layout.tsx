import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar/>
      <main className="grow p-4">{children}</main>
    </SidebarProvider>
  )
}

function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
