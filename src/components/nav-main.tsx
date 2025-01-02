'use client'

import { useTranslations } from 'next-intl'
import { NavItem } from '@/constants/navigation'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

export function NavMain({ items }: { items: NavItem[] }) {
  const t = useTranslations()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.titleKey}>
            <Link href={item.url}>
              <SidebarMenuButton tooltip={t(item.titleKey)}>
                {item.icon && <item.icon />}
                <span>{t(item.titleKey)}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
