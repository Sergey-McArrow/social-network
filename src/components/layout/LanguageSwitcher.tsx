'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { languages } from '@/constants/langs'
import { useLocale } from 'next-intl'
import clsx from 'clsx'

export const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()

  const currentLang =
    languages.find((lang) => lang.code === locale) || languages[0]

  const changeLanguage = (langCode: string) => {
    startTransition(() => {
      const segments = pathname?.split('/')
      if (segments && segments.length > 1) {
        segments[1] = langCode
        const newPathname = segments.join('/')
        router.push(newPathname)
        router.refresh()
      }
    })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={clsx(
          'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-white/10 transition-colors hover:bg-white/20',
          isPending && 'opacity-50'
        )}
      >
        <Image
          src={currentLang.flag.src}
          alt={currentLang.name}
          width={24}
          height={17}
          className="rounded"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 rounded-md border bg-background shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              disabled={isPending}
              className={clsx(
                'flex h-10 w-10 items-center justify-center first:rounded-t-md last:rounded-b-md hover:bg-white/20',
                isPending && 'opacity-50'
              )}
            >
              <Image
                src={lang.flag.src}
                alt={lang.name}
                width={24}
                height={17}
                className="rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
