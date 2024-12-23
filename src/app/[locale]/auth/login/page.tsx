import { signIn } from '@/auth'
import googleImg from '@/assets/icons/loginIcons/google.svg'
import facebookImg from '@/assets/icons/loginIcons/facebook.svg'
import logoImg from '@/assets/icons/TailBook_ecosystem.png'
import bannerImg from '@/assets/icons/banner.png'

import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

const LoginPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const t = await getTranslations()

  return (
    <div className='min-h-screen p-2 container mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <Image src={logoImg.src} alt='Logo' width={80} height={30} />
        <LanguageSwitcher locale={locale} />
      </div>
      <div>
        <div className='flex flex-col gap-8 md:flex-row items-center justify-evenly'>
          <div className='w-56 h-56 relative md:w-72 md:h-72'>
            <Image
              src={bannerImg.src}
              alt='Banner'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
          <div>
            <p className='w-48 sm:w-full text-xl mx-auto mb-6 text-center'>
              {t('index.bannerText')}
            </p>
            <div className='p-8 rounded-lg shadow-md w-96 sm:w-full mx-auto'>
              <h1 className='mb-8 text-xl text-center'>{t('auth.signIn')}</h1>
              <div className='flex justify-between w-1/2 mx-auto'>
                <form
                  action={async () => {
                    'use server'
                    await signIn('google', { redirectTo: '/' })
                  }}
                >
                  <button>
                    <Image
                      src={googleImg.src}
                      alt='Google'
                      width={48}
                      height={48}
                    />
                  </button>
                </form>
                <button>
                  <Image
                    src={facebookImg.src}
                    alt='Facebook'
                    width={48}
                    height={48}
                    className='grayscale cursor-not-allowed'
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
