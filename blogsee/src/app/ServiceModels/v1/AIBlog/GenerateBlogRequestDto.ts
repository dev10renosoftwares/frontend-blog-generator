import { BlogAudience } from "../../../Enums_TypeScript/BlogAudience";
import { BlogLanguage } from "../../../Enums_TypeScript/BlogLanguage";
import { BlogTone } from "../../../Enums_TypeScript/BlogTone";
import { BlogWordCount } from "../../../Enums_TypeScript/BlogWordCount";


export interface GenerateBlogRequestDto {
  categoryId: number;
  topic: string;
  audience: BlogAudience;
  tone: BlogTone;
  wordCount: BlogWordCount;
  language: BlogLanguage;
}
