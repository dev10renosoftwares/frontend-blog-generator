export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
  errors: any;
}

export interface AuthData {
  userId: number;
  userName: string;
  email: string;
  role: string;
  availableCredits: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}