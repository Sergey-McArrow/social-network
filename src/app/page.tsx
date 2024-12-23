import { auth, signIn } from '@/auth'

const Home = async () => {
  const session = await auth()

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <form
          action={async () => {
            'use server'
            await signIn('google')
          }}
        >
          <button type='submit'>Signin with Google</button>
        </form>
        {session?.user && (
          <>
            <p>Logged in as {session.user.email}</p>
            <p>Logged in as {session.user.name}</p>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
