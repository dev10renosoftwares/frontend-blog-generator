
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';

import { UserProfileDto } from '../ServiceModels/v1/Profile/UserProfileDto';
import { UploadProfilePictureResponseDto } from '../ServiceModels/v1/Profile/UploadProfilePictureResponseDto';
import { UpdateProfileRequestDto } from '../ServiceModels/v1/Profile/UpdateProfileRequestDto';
import { ChangePasswordRequestDto } from '../ServiceModels/v1/Profile/ChangePasswordRequestDto';
import { DeleteAccountRequestDto } from '../ServiceModels/v1/Profile/DeleteAccountRequestDto';

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


  // ============================================================
  // UPDATE USERNAME
  // ============================================================

  updateProfile(
    request: UpdateProfileRequestDto
  ): Observable<unknown> {

    return this.http.put<unknown>(
      this.apiUrl,
      request
    );
  }


  // ============================================================
  // UPLOAD PROFILE PICTURE
  // ============================================================

  uploadProfilePicture(
    file: File
  ): Observable<UploadProfilePictureResponseDto> {

    const formData =
      new FormData();

    formData.append(
      'file',
      file,
      file.name
    );

    return this.http.post<UploadProfilePictureResponseDto>(
      `${this.apiUrl}/upload-picture`,
      formData
    );
  }


  // ============================================================
  // DELETE PROFILE PICTURE
  // ============================================================

  deleteProfilePicture(): Observable<unknown> {

    return this.http.delete<unknown>(
      `${this.apiUrl}/picture`
    );
  }


  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  changePassword(
    request: ChangePasswordRequestDto
  ): Observable<unknown> {

    return this.http.put<unknown>(
      `${this.apiUrl}/change-password`,
      request
    );
  }


  // ============================================================
  // DELETE ACCOUNT
  // ============================================================

  deleteAccount(
    request: DeleteAccountRequestDto
  ): Observable<unknown> {

    return this.http.request<unknown>(
      'DELETE',
      this.apiUrl,
      {
        body: request
      }
    );
  }

}

