export interface UserProfileResponse {
  userId: number;
  userName: string;
  email: string;
  profilePictureUrl: string | null;
  availableCredits: number;
  role: string;
  createdAt: string;
}

export interface UserProfileApiResponse {
  success: boolean;
  message: string;
  data: UserProfileResponse;
  errors: any;
}