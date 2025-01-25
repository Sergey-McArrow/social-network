'use client'

import { FC } from 'react'
import { Card } from './card'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Eye, Heart, MessageCircle, Send } from 'lucide-react'
import { TPost } from '@/types/models'
import { formatDate, getInitials } from '@/lib/utils/helpers'
import { addOrRemoveLikeAction } from '@/actions/addOrRemoveLike'
import Image from 'next/image'
import { AspectRatio } from './aspect-ratio'
import { ActionBtn } from './action-btn'
import { useUser } from '@clerk/nextjs'
import { Skeleton } from './skeleton'

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
  const { user, isSignedIn } = useUser()
  const liked = isSignedIn && likes.some((like) => like.authorId === user?.id)
  // const isOwnPost = isSignedIn && author.id === user?.id

  if (!isSignedIn) {
    return <PostCardSkeleton />
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-4 p-4">
        <Avatar>
          <AvatarImage src={author.userImage ?? ''} alt={author.name ?? ''} />
          <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{author.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(createdAt.toISOString())}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{content}</p>
          {imageUrl && (
            <AspectRatio ratio={4 / 5} className="overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={content}
                className="object-cover"
                fill
              />
            </AspectRatio>
          )}
          <div className="flex items-center gap-4 pt-2">
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
            <p className="flex items-center gap-2">
              <Eye />
              {views}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 p-2">
        <p>{likes.length} likes</p>
        <p>{comments.length} comments</p>
      </div>
      <p className="p-2 align-baseline">
        <span className="font-bold">{author.name}</span> {content}
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

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-4 p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </Card>
  )
}
