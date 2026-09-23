export interface FeedBlogDto {
  blogId: number;
  title: string;
  slug: string;
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
