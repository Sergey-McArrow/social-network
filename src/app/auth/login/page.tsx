import Image from 'next/image'
import { signIn } from '@/auth'
import googleImg from '@/assets/icons/google.svg'

export const runtime = 'nodejs'

const LoginPage = async () => {
  return (
    <div className='min-h-screen flex items-center justify-center '>
      <div className='max-w-md w-full space-y-8 p-8  rounded-lg shadow-lg'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-bold '>Sign in to your account</h2>
          <p className='mt-2 text-sm '>To start using Tailgramm today</p>
        </div>

        <div className='mt-8 space-y-6'>
          <form
            action={async () => {
              'use server'
              await signIn('google', { redirectTo: '/' })
            }}
          >
            <button className='w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'>
              <Image
                src={googleImg}
                alt='Google logo'
                width={20}
                height={20}
                priority
              />
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
