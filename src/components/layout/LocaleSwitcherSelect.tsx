'use client'

import clsx from 'clsx'
import { ChangeEvent, ReactNode, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  children: ReactNode
  defaultValue: string
  label: string
}

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value
    startTransition(() => {
      const segments = pathname?.split('/')
      if (segments && segments.length > 1) {
        segments[1] = nextLocale
        const newPathname = segments.join('/')
        router.push(newPathname)
        router.refresh()
      }
    })
  }

  return (
    <label
      className={clsx(
        'relative text-gray-400',
        isPending && 'transition-opacity [&:disabled]:opacity-30'
      )}
    >
      <p className='sr-only'>{label}</p>
      <select
        className='inline-flex appearance-none bg-transparent py-3 pl-2 pr-6'
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span className='pointer-events-none absolute right-2 top-[8px]'>⌄</span>
    </label>
  )
}
