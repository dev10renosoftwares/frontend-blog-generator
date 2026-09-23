export interface AuthResponseDto {
  userId: number;
  userName: string;
  email: string;
  role: string;
  availableCredits: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}
