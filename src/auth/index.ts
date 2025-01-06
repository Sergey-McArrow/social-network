import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // cookies: {
  //   sessionToken: {
  //     name: `${authConfig.cookies?.sessionToken?.name}`,
  //     options: {
  //       ...authConfig.cookies?.sessionToken?.options,
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: process.env.NODE_ENV === 'production',
  //     },
  //   },
  // },
})
