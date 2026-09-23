export interface PublicUserProfileDto {
  userId: number;
  userName: string;
  profilePictureUrl: string | null;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}
