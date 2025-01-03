export const postQuery = {
  select: {
    id: true,
    content: true,
    imageUrl: true,
    likes: true,
    views: true,
    createdAt: true,
    author: {
      select: {
        id: true,
        name: true,
        userImage: true,
      },
    },
    comments: {
      select: {
        author: {
          select: {
            id: true,
            name: true,
            userImage: true,
          },
        },
        content: true,
        createdAt: true,
        id: true,
      },
    },
  },
}
