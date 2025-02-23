'use client'

import { database } from '@/lib/firebase'
import { User } from 'next-auth'
import { useTranslations } from 'next-intl'
import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import {
  get,
  query,
  ref,
  set,
  push,
  orderByChild,
  onValue,
  onDisconnect,
  update,
} from 'firebase/database'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { TChatMessage, TUserWithStatus } from '@/types'
import { MessageItem } from './message-item'
import { UserList } from './user-list'

interface ChatRoomProps {
  users: User[]
}

export const ChatRoom: FC<ChatRoomProps> = ({ users }) => {
  const { data: session } = useSession()
  const t = useTranslations('messages')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chatRoom, setChatRoom] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<TChatMessage[]>([])
  const [chatPartner, setChatPartner] = useState<User | null>(null)
  const [usersOnline, setUsersOnline] = useState<TUserWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getOrCreateChat = async (user: User) => {
    if (!session?.user?.id) return

    const user1Id = session.user.id
    const user2Id = user.id
    if (!user1Id || !user2Id) return
    setChatPartner(user)
    const chatKey = [user1Id, user2Id].sort().join('-')

    try {
      const chatRef = ref(database, 'chats/' + chatKey)
      const snapshot = await get(chatRef)

      if (!snapshot.exists()) {
        await set(chatRef, {
          participants: {
            [user1Id]: true,
            [user2Id]: true,
          },
          createdAt: new Date().toISOString(),
        })
      }

      setChatRoom(chatKey)
    } catch (error) {
      console.error('Error fetching/creating chat:', error)
    }
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !chatRoom) return

    try {
      const messagesRef = ref(database, `chats/${chatRoom}/messages`)
      const newMessageRef = push(messagesRef)
      const messageData: TChatMessage = {
        sender: session?.user?.id ?? '',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
      }

      await set(newMessageRef, messageData)
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!session?.user?.id) return

    const userStatusRef = ref(database, `users/${session.user.id}`)
    const userStatusDatabaseRef = ref(database, '.info/connected')

    const updateUserStatus = (status: 'online' | 'offline') => {
      update(userStatusRef, {
        status,
        lastSeen: new Date().toISOString(),
      })
    }

    const unsubscribe = onValue(userStatusDatabaseRef, (snapshot) => {
      if (snapshot.val() === true) {
        updateUserStatus('online')

        onDisconnect(userStatusRef).update({
          status: 'offline',
          lastSeen: new Date().toISOString(),
        })
      }
    })

    return () => {
      unsubscribe()
      updateUserStatus('offline')
    }
  }, [session?.user?.id])

  useEffect(() => {
    const usersRef = ref(database, 'users')
    const usersQuery = query(usersRef)

    setLoading(true)
    const unsubscribe = onValue(
      usersQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val()
          const usersArray = Object.entries(usersData).map(([id, value]) => ({
            ...(value as TUserWithStatus),
            id,
          }))
          setUsersOnline(usersArray.filter((u) => u.status === 'online'))
        } else {
          setUsersOnline([])
        }
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Error fetching users:', error)
        setError('Failed to fetch users status')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!chatRoom) return

    const messagesRef = ref(database, `chats/${chatRoom}/messages`)
    const messagesQuery = query(messagesRef, orderByChild('timestamp'))

    const unsubscribe = onValue(
      messagesQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = snapshot.val()
          const messagesArray = Object.values(messagesData).map(
            (value) => value as TChatMessage
          )
          setMessages(messagesArray)
        } else {
          setMessages([])
        }
      },
      (error) => {
        console.error('Error fetching messages:', error)
      }
    )

    return () => unsubscribe()
  }, [chatRoom])

  if (!session) return null

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    )
  }

  return (
    <section className="rounded-lg bg-card p-4 md:col-span-2">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[250px_1fr]">
        <div className="border-r p-4 md:border-none">
          <div className="mb-4">
            <Input
              type="text"
              placeholder={t('search_users')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <UserList
            users={filteredUsers.map((u) => {
              const onlineUser = usersOnline.find(
                (online) => online.id === u.id
              )
              return {
                ...u,
                status: onlineUser ? 'online' : 'offline',
                lastSeen: onlineUser?.lastSeen ?? new Date().toISOString(),
              }
            })}
            currentUserId={session.user.id}
            onSelectUser={getOrCreateChat}
            loading={loading}
          />
        </div>
        <div className="mx-5 p-4">
          {chatRoom ? (
            <Card className="col-span-3 flex h-[600px] flex-col space-y-4 overflow-hidden p-4">
              <div className="flex-1 space-y-2 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <MessageItem
                      key={index}
                      message={message}
                      isCurrentUser={message.sender === session.user.id}
                      userImage={session.user.image}
                      partnerImage={chatPartner?.image}
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    {t('no_messages')}
                  </p>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('type_message')}
                  className="flex-1 px-2"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  {t('send')}
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="flex h-[600px] flex-col items-center justify-center">
              <p className="text-center text-muted-foreground">
                {t('select_conversation')}
              </p>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
