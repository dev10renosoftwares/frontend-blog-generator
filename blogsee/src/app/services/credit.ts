
import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CreditService {

  private apiUrl =
    'http://192.168.29.71:5229';


  constructor(
    private http: HttpClient
  ) {}


  getCredits(): Observable<any> {

    const token =
      localStorage.getItem(
        'accessToken'
      );


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    return this.http.get<any>(

      `${this.apiUrl}/api/v1/Credits`,

      {
        headers
      }

    );

  }

}

