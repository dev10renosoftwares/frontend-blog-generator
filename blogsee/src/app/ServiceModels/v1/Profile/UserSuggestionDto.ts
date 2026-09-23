export interface UserSuggestionDto {
  userId: number;
  userName: string;
  profilePictureUrl: string | null;
  followersCount: number;
}
