export interface PostTypes {
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

export interface PostInputTypes {
  imageUrl: string;
  title: string;
  content: string;
  userId: number;
}
