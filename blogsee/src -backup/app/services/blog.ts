import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{FeedBlogDto} from '../ServiceModels/v1/PublicFeed/FeedBlogDto';
import { CategoryResponseDto } from '../ServiceModels/v1/Category/CategoryResponseDto';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = 'http://192.168.29.71:5229/api/v1';

  constructor(private http: HttpClient) {}

  getPublicFeed(): Observable<FeedBlogDto[]> {
    return this.http.get<FeedBlogDto[]>(
      `${this.apiUrl}/PublicFeed`
    );
  }
// =====================================================
  // GET CATEGORIES
  // =====================================================

  getCategories(): Observable<CategoryResponseDto[]> {

    return this.http.get<CategoryResponseDto[]>(
      `${this.apiUrl}/Category`
    );

  }
}