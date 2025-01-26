'use client'

import { FC, useActionState, useEffect } from 'react'
import { Card } from './card'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Button } from './button'
import { Eye, Heart, MessageCircle, Send } from 'lucide-react'
import { TPost } from '@/types/models'
import { formatDate, getInitials } from '@/lib/utils/helpers'
import { addOrRemoveLikeAction } from '@/actions/addOrRemoveLike'
import Image from 'next/image'
import { AspectRatio } from './aspect-ratio'
import { ActionBtn } from './action-btn'
import { useSession } from 'next-auth/react'
import { Skeleton } from './skeleton'
import { followOrUnfollow } from '@/actions/follow'
import { toast } from 'sonner'

export const PostCard: FC<TPost> = ({
  id,
  author,
  content,
  imageUrl,
  comments,
  views,
  likes,
  createdAt,
}) => {
  const { data: session, status } = useSession()
  const liked =
    status === 'authenticated' &&
    likes.some((like) => like.authorId === session?.user?.id)
  const isOwnPost =
    status === 'authenticated' && author?.id === session?.user?.id
  const isFollowing = author?.followedByIDs.includes(session?.user?.id ?? '')

  const [followState, followAction, isLoading] = useActionState(
    followOrUnfollow,
    null
  )

  useEffect(() => {
    if (followState?.message) {
      toast.success(followState.message)
    }
    if (followState?.error) {
      toast.error(followState.error)
    }
  }, [followState])

  if (status === 'loading') {
    return <PostCardSkeleton />
  }
  const btnFollowText = isFollowing ? 'Unfollow' : 'Follow'
  return (
    <Card>
      <div className="flex items-center gap-4 px-2 py-4">
        <Avatar>
          <AvatarImage
            src={author?.userImage ?? author?.image ?? ''}
            alt={author?.name ?? ''}
          />
          <AvatarFallback>{getInitials(author?.name ?? '')}</AvatarFallback>
        </Avatar>
        <p> {author?.name}</p>
        <p className="truncate text-xs md:text-sm">
          • {formatDate(createdAt.toISOString())} •
        </p>
        {!isOwnPost ? (
          <form action={followAction}>
            <input type="hidden" name="userId" value={author?.id} />
            <Button
              type="submit"
              variant="ghost"
              className="text-sky-600 dark:text-sky-400"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : btnFollowText}
            </Button>
          </form>
        ) : null}
      </div>
      <AspectRatio ratio={4 / 5} className="max-h-96 overflow-hidden">
        <Image
          src={imageUrl}
          alt={content}
          loading="lazy"
          fill
          className="rounded-md object-cover"
        />
      </AspectRatio>
      <div className="flex items-center justify-between">
        <div className="mt-2 flex items-center gap-2 p-2">
          <ActionBtn
            action={addOrRemoveLikeAction}
            fields={[
              { name: 'postId', value: id },
              { name: 'liked', value: String(liked) },
            ]}
          >
            <Heart
              fill={liked ? 'red' : 'none'}
              stroke={liked ? 'red' : 'white'}
              className="-mb-2"
            />
          </ActionBtn>

          <button>
            <MessageCircle />
          </button>
          <button>
            <Send />
          </button>
        </div>
        <p className="flex items-center gap-2 px-2">
          <Eye />
          {views}
        </p>
      </div>
      <div className="flex gap-2 p-2">
        <p>{likes.length} likes</p>
        <p>{comments.length} comments</p>
      </div>
      <p className="p-2 align-baseline">
        <span className="font-bold">{author?.name}</span> {content}
      </p>
      {comments.length ? (
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center gap-2 p-2">
              <Avatar>
                <AvatarImage
                  src={comment.author.userImage ?? ''}
                  alt={comment.author.name ?? ''}
                />
                <AvatarFallback>
                  {getInitials(comment.author.name)}
                </AvatarFallback>
              </Avatar>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  )
}
const PostCardSkeleton = () => {
  return (
    <Card>
      <div className="flex items-center gap-4 px-2 py-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-64 w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </Card>
  )
}
