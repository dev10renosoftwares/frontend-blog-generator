export interface GenerateBlogResponseDto {
  blogId: number;
  title: string;
  content: string;
  excerpt: string | null;
  creditsUsed: number;
  remainingCredits: number;
}
