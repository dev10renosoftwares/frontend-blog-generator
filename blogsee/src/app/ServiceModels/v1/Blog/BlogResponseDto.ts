export interface BlogResponseDto {
  blogId: number;
  title: string;
  content: string;
  excerpt: string | null;
  tone: string;
  audience: string;
  wordCount: number;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}
