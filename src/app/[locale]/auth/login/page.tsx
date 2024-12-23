import { signIn } from '@/auth'
import googleImg from '@/assets/icons/google.svg'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export default async function LoginPage() {
  const t = await getTranslations()

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='p-8 rounded-lg shadow-md w-96'>
        <h1 className='text-2xl font-bold mb-6 text-center'>
          {t('auth.signIn')}
        </h1>
        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/' })
          }}
        >
          <button className='w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
            <Image src={googleImg.src} alt='Google' className='w-5 h-5' />
            {t('auth.signInWithGoogle')}
          </button>
        </form>
      </div>
    </div>
  )
}
