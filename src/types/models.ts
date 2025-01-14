import { Prisma } from '@prisma/client'

export type TUser = Prisma.UserGetPayload<{
  select: { [K in keyof Required<Prisma.UserSelect>]: true }
}>

export type TPost = Prisma.PostGetPayload<{
  select: {
    id: true
    content: true
    imageUrl: true
    likes: {
      select: {
        authorId: true
      }
    }
    views: true
    createdAt: true
    author: {
      select: {
        id: true
        name: true
        userImage: true
      }
    }
    comments: {
      select: {
        author: {
          select: {
            id: true
            name: true
            userImage: true
          }
        }
        content: true
        createdAt: true
        id: true
      }
    }
  }
}>
