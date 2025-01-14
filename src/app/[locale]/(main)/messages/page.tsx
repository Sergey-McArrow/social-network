import { ChatRoom } from '@/components/messages/chat-room'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/prisma'

export const dynamic = 'force-dynamic'

const MessagesPage = async () => {
  const t = await getTranslations('messages')
  const users = await prisma.user.findMany()

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">{t('title')}</h1>
      <ChatRoom users={users} />
    </div>
  )
}

export default MessagesPage
