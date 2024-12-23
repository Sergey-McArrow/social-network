import { auth } from '@/auth'
import { getTranslations } from 'next-intl/server'

const HomePage = async () => {
  const session = await auth()
  const t = await getTranslations()

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        {session?.user && (
          <>
            <p>
              {t('auth.loggedInAs')} {session.user.email}
            </p>
            <form action='/api/auth/signout' method='POST'>
              <button type='submit' className='text-red-500 hover:text-red-700'>
                {t('auth.logout')}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}

export default HomePage
