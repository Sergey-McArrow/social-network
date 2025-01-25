'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { NavMain } from '@/components/ui/nav-main'
import { useUser } from '@clerk/nextjs'
import { NavUser } from '@/components/ui/nav-user'
import logoImg from '@/assets/icons/TailBook_ecosystem.png'
import Image from 'next/image'
import { MAIN_NAV_ITEMS } from '@/constants/navigation'
import { LanguageSwitcher } from '../layout/LanguageSwitcher'
import { ThemeSwitcher } from '../layout/theme-switcher'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  if (!user) return null

  return (
    <Sidebar collapsible="icon" {...props} className="max-h-svh">
      <SidebarHeader className="w-full py-2">
        <div className="flex items-center justify-between gap-2">
          <Image src={logoImg.src} alt="Logo" width={80} height={30} />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MAIN_NAV_ITEMS} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
