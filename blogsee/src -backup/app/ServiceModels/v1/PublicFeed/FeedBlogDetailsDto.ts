export interface FeedBlogDetailsDto {
  blogId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImageUrl: string | null;
  userId: number;
  authorName: string;
  categoryId: number;
  categoryName: string;
  wordCount: number;
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
}
