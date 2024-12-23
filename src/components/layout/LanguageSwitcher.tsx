'use client'

import { FC, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { languages } from '@/const/langs'

type TPropsWithLocaleKey = { locale: (typeof languages)[number]['code'] }

export const LanguageSwitcher: FC<TPropsWithLocaleKey> = ({ locale }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang =
    languages.find((lang) => lang.code === (locale || 'en')) || languages[0]

  const changeLanguage = (langCode: string) => {
    const newPathname = pathname?.replace(/^\/[^\/]+/, `/${langCode}`)
    if (newPathname) {
      router.push(newPathname)
    }
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-white/10 hover:bg-white/20 border-2 border-transparent rounded-full w-10 h-10 flex justify-center items-center cursor-pointer transition-colors'
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
        <div className='absolute right-0 mt-1 rounded-md shadow-lg border'>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className='w-10 h-10 flex justify-center items-center hover:bg-white/20 first:rounded-t-md last:rounded-b-md'
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
