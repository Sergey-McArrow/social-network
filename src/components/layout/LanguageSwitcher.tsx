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
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={clsx(
          'bg-white/10 hover:bg-white/20 border-2 border-transparent rounded-full w-10 h-10 flex justify-center items-center cursor-pointer transition-colors',
          isPending && 'opacity-50'
        )}
      >
        <Image
          src={currentLang.flag.src}
          alt={currentLang.name}
          width={24}
          height={17}
          className='rounded'
        />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-1 rounded-md shadow-lg border z-10 bg-background'>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              disabled={isPending}
              className={clsx(
                'w-10 h-10 flex justify-center items-center hover:bg-white/20 first:rounded-t-md last:rounded-b-md',
                isPending && 'opacity-50'
              )}
            >
              <Image
                src={lang.flag.src}
                alt={lang.name}
                width={24}
                height={17}
                className='rounded'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
