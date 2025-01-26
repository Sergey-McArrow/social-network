import { Prisma } from '@prisma/client'

export const postQuery = {
  select: {
    id: true,
    content: true,
    imageUrl: true,
    views: true,
    createdAt: true,
    likes: true,
    author: {
      select: {
        id: true,
        name: true,
        userImage: true,
        image: true,
      },
    },
    comments: {
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            userImage: true,
            image: true,
          },
        },
      },
    },
  },
}

export type TPostWithRelations = Prisma.PostGetPayload<{
  select: (typeof postQuery)['select']
}>
