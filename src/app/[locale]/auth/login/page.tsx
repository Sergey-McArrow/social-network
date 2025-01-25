import logoImg from '@/assets/icons/TailBook_ecosystem.png'
import bannerImg from '@/assets/icons/banner.png'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'

const LoginPage = async () => {
  const t = await getTranslations()

  return (
    <div className="container mx-auto min-h-svh p-2">
      <div className="mb-10 flex items-center justify-between">
        <Image src={logoImg.src} alt="Logo" width={80} height={30} />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-evenly md:flex-row md:gap-16">
          <div className="relative h-56 w-56 overflow-hidden rounded-2xl md:h-72 md:w-72">
            <Image
              src={bannerImg.src}
              alt="Banner"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="mx-auto w-96 rounded-lg p-4 sm:w-1/2 md:h-72 md:shadow-md">
            <p className="mx-auto w-56 p-2 text-center text-xl sm:w-full md:p-8">
              {t('index.bannerText')}
            </p>
            <div className="flex justify-center">
              <div className="">
                <h1 className="mb-8 text-center text-xl">{t('auth.signIn')}</h1>
                <SocialAuthButtons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
