import { FC, Fragment, PropsWithChildren } from 'react'
import { AppSidebar } from '@/components/ui/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { getServerPathname, getBreadcrumbsFromPath } from '@/lib/utils/path'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const pathname = await getServerPathname()
  const breadcrumbs = getBreadcrumbsFromPath(pathname)
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="fixed top-0 z-10 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-inherit transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map(({ href, label, isLast }) => (
                    <Fragment key={href}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="mt-16 flex h-svh flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </SessionProvider>
  )
}

export default Layout
