import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = 'http://192.168.29.71:5229/api/v1';

  constructor(private http: HttpClient) {}

  getPublicFeed(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/PublicFeed`
    );
  }

}