
import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl =
    'http://192.168.29.71:5229';


  constructor(
    private http: HttpClient
  ) {}


  getProfile(): Observable<any> {

    const token =
      localStorage.getItem(
        'accessToken'
      );


    console.log(
      'Profile JWT exists:',
      !!token
    );


    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    return this.http.get<any>(

      `${this.apiUrl}/api/v1/Profile`,

      {
        headers
      }

    );

  }

}

