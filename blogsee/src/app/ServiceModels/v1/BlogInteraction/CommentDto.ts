export interface CommentDto {
  commentId: number;
  blogId: number;
  userId: number;
  userName: string;
  profilePictureUrl: string | null;
  content: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string | null;
}
