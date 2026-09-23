
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { UserProfileDto } from '../ServiceModels/v1/Profile/UserProfileDto';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly apiUrl =
    `${environment.apiUrl}/Profile`;


  constructor(
    private http: HttpClient
  ) {}


  // ============================================================
  // GET PROFILE
  // ============================================================

  getProfile(): Observable<UserProfileDto> {

    return this.http.get<UserProfileDto>(
      this.apiUrl
    );
  }

}

