export interface PublicUserBlogDto {
  blogId: number;
  title: string;
  content: string | null;
  coverImageUrl: string | null;
  publishedAt: string;
}
