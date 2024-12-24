import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  PlusSquareIcon,
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

export interface NavItem {
  titleKey: string
  url: string
  icon?: LucideIcon
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    titleKey: 'nav.home',
    url: '/',
    icon: Home,
  },
  {
    titleKey: 'nav.search',
    url: '/search',
    icon: Search,
  },
  {
    titleKey: 'nav.explore',
    url: '/explore',
    icon: Compass,
  },
  {
    titleKey: 'nav.messages',
    url: '/messages',
    icon: MessageCircle,
  },
  {
    titleKey: 'nav.notifications',
    url: '/notifications',
    icon: Heart,
  },
  {
    titleKey: 'nav.create',
    url: '/create',
    icon: PlusSquareIcon,
  },
]
