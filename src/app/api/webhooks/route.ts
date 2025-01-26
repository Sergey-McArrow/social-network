import { prisma } from './../../../prisma/index'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { currentUser, WebhookEvent } from '@clerk/nextjs/server'
import { createUser } from '@/lib/utils/users'
import { User } from '@prisma/client'
export async function POST(req: Request) {
  try {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
      throw new Error(
        'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
      )
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error: Missing Svix headers', {
        status: 400,
      })
    }

    // Get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    // Verify payload with headers
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent
    } catch (err) {
      console.error('Error: Could not verify webhook:', err)
      return new Response('Error: Verification error', {
        status: 400,
      })
    }

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', body)
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data

      if (!id || !email_addresses) {
        return new Response('Error occurred -- missing data', {
          status: 400,
        })
      }

      const user = {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        image: image_url,
      }

      await createUser(user as User)
    }
    if (eventType === 'session.created') {
      const { user_id } = evt.data
      const existingUser = await prisma.user.findUnique({
        where: { clerkUserId: user_id },
      })

      if (existingUser) {
        return new Response('User already exists', { status: 200 })
      }

      const user = await currentUser()
      if (!user) {
        return new Response('User not found', { status: 400 })
      }
      const newUser = {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName,
        image: user.imageUrl,
      }
      await createUser(newUser as User)
    }

    return new Response('Webhook received', { status: 200 })
  } catch (error) {
    console.error('Webhook verification failed:', error)
    return new Response('Webhook verification failed', { status: 400 })
  }
}
