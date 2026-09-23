export interface UserProfileDto {
  userId: number;
  userName: string;
  email: string;
  profilePictureUrl: string | null;
  availableCredits: number;
  role: string;
  createdAt: string;
}
