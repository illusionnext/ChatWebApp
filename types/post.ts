export interface Post {
  id: number;
  imageUrl: string;
  title: string;
  content: string;
  createdAt: string;
  userFirstName: string;
  userLastName: string;
  likes: number;
  isLiked: boolean;
}

export interface PostInput {
  imageUrl: string;
  title: string;
  content: string;
  userId: number;
}

export interface Like {
  userId: number;
  postId: number;
}
