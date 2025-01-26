'use client'

import { useSignIn } from '@clerk/nextjs'
import { OAuthStrategy } from '@clerk/types'
import Image from 'next/image'
import googleImg from '@/assets/icons/loginIcons/google.svg'
import facebookImg from '@/assets/icons/loginIcons/facebook.svg'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams } from 'next/navigation'

export const SocialAuthButtons = () => {
  const params = useParams()
  const { isLoaded, signIn } = useSignIn()
  if (!isLoaded || !signIn)
    return (
      <div className="mx-auto flex justify-between gap-6">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: `/${params.locale ?? 'en'}`,
    })
  }

  return (
    <div className="mx-auto flex justify-between gap-6">
      <button onClick={() => signInWith('oauth_google')}>
        <Image src={googleImg.src} alt="Google" width={48} height={48} />
      </button>
      <button
        onClick={() => signInWith('oauth_facebook')}
        className="cursor-not-allowed opacity-50"
      >
        <Image src={facebookImg.src} alt="Facebook" width={48} height={48} />
      </button>
      <div id="clerk-captcha"></div>
    </div>
  )
}
