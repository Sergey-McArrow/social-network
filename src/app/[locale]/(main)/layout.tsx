import { FC, Fragment, PropsWithChildren } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
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
          <header className='fixed top-0 z-10 flex h-16 bg-inherit w-full border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 '>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator orientation='vertical' className='mr-2 h-4' />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href='/'>Home</BreadcrumbLink>
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
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0 h-svh mt-16 overflow-y-auto '>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </SessionProvider>
  )
}

export default Layout
