import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreditResponse {
  success: boolean;
  message: string;
  data: {
    availableCredits: number;
  };
  errors: any;
}

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  private apiUrl =
    'http://192.168.29.71:5229/api/v1/Credits';

  constructor(
    private http: HttpClient
  ) {}

  getCredits(): Observable<CreditResponse> {

    const token =
      localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<CreditResponse>(
      this.apiUrl,
      { headers }
    );
  }
}