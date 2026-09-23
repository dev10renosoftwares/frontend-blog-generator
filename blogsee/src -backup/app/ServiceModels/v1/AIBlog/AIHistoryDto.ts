export interface AIHistoryDto {
  blogVersionId: number;
  blogId: number;
  content: string;
  operation: string | null;
  creditsUsed: number;
  createdAt: string;
}
