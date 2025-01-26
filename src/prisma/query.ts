export const postQuery = {
  select: {
    id: true,
    content: true,
    imageUrl: true,
    likes: {
      select: {
        authorId: true,
      },
    },
    views: true,
    createdAt: true,
    author: {
      select: {
        id: true,
        name: true,
        userImage: true,
        image: true,
        followedByIDs: true,
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
