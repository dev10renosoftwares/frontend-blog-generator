export interface UpdateBlogRequestDto {
  title: string;
  content: string;
  excerpt: string | null;
  tone: string;
  audience: string;
  wordCount: number;
}
