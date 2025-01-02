import { FC } from 'react'
import { Card } from './card'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Button } from './button'
import { Eye, Heart, MessageCircle, Send } from 'lucide-react'
import { TPost } from '@/types/models'
import { formatDate, getInitials } from '@/lib/utils/helpers'
import { addLikeAction } from '@/actions/addLike'
import { deleteLikeAction } from '@/actions/deleteLike'
import Image from 'next/image'
import { AspectRatio } from './aspect-ratio'

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
  const liked = likes.some((like) => like.authorId === author.id)
  const isOwnPost = id === author.id
  return (
    <Card>
      <div className="flex items-center gap-4 px-2 py-4">
        <Avatar>
          <AvatarImage src={author.userImage ?? ''} alt={author.name ?? ''} />
          <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
        </Avatar>
        <p> {author.name}</p>
        <p className="text-xs md:text-sm">
          • {formatDate(createdAt.toISOString())} •
        </p>
        {isOwnPost ? (
          <Button variant="ghost" className="text-sky-600 dark:text-sky-400">
            follow
          </Button>
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
          <form action={liked ? deleteLikeAction : addLikeAction}>
            <input type="hidden" name="postId" value={id} />
            <button type="submit">
              <Heart
                fill={liked ? 'red' : 'none'}
                stroke={liked ? 'red' : 'white'}
                className="-mb-1.5"
              />
            </button>
          </form>
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
