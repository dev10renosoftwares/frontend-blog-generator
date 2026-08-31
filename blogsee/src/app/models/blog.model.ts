export interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;

  author: {
    id?: number;
    username: string;
  };

  createdAt: string;
  readTime?: number;
}