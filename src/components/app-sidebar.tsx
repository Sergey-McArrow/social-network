'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavMain } from '@/components/nav-main'
import { useSession } from 'next-auth/react'
import { NavUser } from '@/components/nav-user'
import logoImg from '@/assets/icons/TailBook_ecosystem.png'
import Image from 'next/image'
import { MAIN_NAV_ITEMS } from '@/constants/navigation'
import { LanguageSwitcher } from './layout/LanguageSwitcher'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  if (!session?.user) return null

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="w-full py-2">
        <div className="flex items-center justify-between gap-2">
          <Image src={logoImg.src} alt="Logo" width={80} height={30} />
          <LanguageSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MAIN_NAV_ITEMS} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
