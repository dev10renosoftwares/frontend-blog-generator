import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import{GenerateBlogRequestDto} from '../ServiceModels/v1/AIBlog/GenerateBlogRequestDto';
import{GenerateBlogResponseDto} from '../ServiceModels/v1/AIBlog/GenerateBlogResponseDto';
import { CategoryResponseDto } from '../ServiceModels/v1/Category/CategoryResponseDto';
// =====================================================
// CATEGORY INTERFACE
// =====================================================


// =====================================================
// CATEGORY API RESPONSE
// =====================================================




@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // =====================================================
  // API URLS
  // =====================================================

  // Blog generation API
  private readonly blogBaseUrl =
    `${environment.apiUrl}/AIBlog`;

  // Category API
  private readonly categoryBaseUrl =
    `${environment.apiUrl}/Category`;

 


  // =====================================================
  // GENERATED BLOG
  // =====================================================

  private generatedBlog: GenerateBlogResponseDto | null = null;

private regenerationPrompt: string = '';
  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // GENERATE BLOG
  // =====================================================

  generateBlog(blogData: GenerateBlogRequestDto): Observable<GenerateBlogResponseDto> {

    console.log(
      'BlogService - Sending Request:',
      blogData
    );
debugger
    return this.http.post<GenerateBlogResponseDto>(
      `${this.blogBaseUrl}/generate`,
      blogData
    );

  }

// =====================================================
// STORE REGENERATION PROMPT
// =====================================================

setRegenerationPrompt(prompt: string): void {

  this.regenerationPrompt = prompt;

}


// =====================================================
// GET REGENERATION PROMPT
// =====================================================

getRegenerationPrompt(): string {

  return this.regenerationPrompt;

}
  // =====================================================
  // GET CATEGORIES
  // =====================================================

 getCategories(): Observable<CategoryResponseDto[]> {
  console.log(
    'BlogService - Getting Categories:',
    this.categoryBaseUrl
  );

  return this.http
    .get<CategoryResponseDto[] | { data: CategoryResponseDto[] }>(this.categoryBaseUrl)
    .pipe(
      map((response: CategoryResponseDto[] | { data: CategoryResponseDto[] }) => {

        console.log(
          'BlogService - Category API Response:',
          response
        );

        // If API returns { data: [...] }
        if (response && 'data' in response && Array.isArray(response.data)) {
          return response.data;
        }

        // If API returns [...] directly
        if (Array.isArray(response)) {
          return response;
        }

        return [];
      })
    );
}


  // =====================================================
  // STORE GENERATED BLOG
  // =====================================================

  setGeneratedBlog(response: GenerateBlogResponseDto): void {

    this.generatedBlog = response;

  }


  // =====================================================
  // GET GENERATED BLOG
  // =====================================================

  getGeneratedBlog(): GenerateBlogResponseDto | null {

    return this.generatedBlog;

  }


  // =====================================================
  // CLEAR GENERATED BLOG
  // =====================================================

  clearGeneratedBlog(): void {

    this.generatedBlog = null;

  }

}