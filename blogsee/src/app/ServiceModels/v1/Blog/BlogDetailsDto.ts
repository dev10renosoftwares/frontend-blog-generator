export interface BlogDetailsDto {
  blogId: number;
  title: string;
  prompt: string;
  content: string;
  tone: string;
  audience: string;
  category: string;
  wordCount: number;
  creditsUsed: number;
  createdAt: string;
  updatedAt: string;
}
