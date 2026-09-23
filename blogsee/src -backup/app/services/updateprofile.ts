import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserProfileDto } from '../ServiceModels/v1/Profile/UserProfileDto';
import { UploadProfilePictureResponseDto } from '../ServiceModels/v1/Profile/UploadProfilePictureResponseDto';
import { UpdateProfileRequestDto } from '../ServiceModels/v1/Profile/UpdateProfileRequestDto';
import { ChangePasswordRequestDto } from '../ServiceModels/v1/Profile/ChangePasswordRequestDto';
import { DeleteAccountRequestDto } from '../ServiceModels/v1/Profile/DeleteAccountRequestDto';

import { environment } from '../../environments/environment.development';

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
  // GET /api/v1/Profile
  // ============================================================

  getProfile(): Observable<UserProfileDto> {

    return this.http.get<UserProfileDto>(
      this.apiUrl
    );

  }


  // ============================================================
  // UPDATE USERNAME
  // PUT /api/v1/Profile
  // ============================================================

  updateProfile(
    userName: string
  ): Observable<UpdateProfileRequestDto> {

    return this.http.put<UpdateProfileRequestDto>(
      this.apiUrl,
      {
        userName: userName.trim()
      }
    );

  }


  // ============================================================
  // UPLOAD PROFILE PICTURE
  // POST /api/v1/Profile/upload-picture
  // ============================================================

  uploadProfilePicture(
    file: File
  ): Observable<UploadProfilePictureResponseDto> {

    const formData = new FormData();

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
  // DELETE /api/v1/Profile/picture
  // ============================================================

  deleteProfilePicture(): Observable<DeleteAccountRequestDto> {

    return this.http.delete<DeleteAccountRequestDto>(
      `${this.apiUrl}/picture`
    );

  }


  // ============================================================
  // CHANGE PASSWORD
  // PUT /api/v1/Profile/change-password
  // ============================================================

  changePassword(
    CurrentPassword: string,
    NewPassword: string,
    ConfirmNewPassword: string
  ): Observable<ChangePasswordRequestDto> {

    return this.http.put<ChangePasswordRequestDto>(
      `${this.apiUrl}/change-password`,
      {
        CurrentPassword,
        NewPassword,
        ConfirmNewPassword
      }
    );

  }


  // ============================================================
  // DELETE ACCOUNT
  // DELETE /api/v1/Profile
  // ============================================================

  deleteAccount(
    reason: string
  ): Observable<DeleteAccountRequestDto> {

    return this.http.request<DeleteAccountRequestDto>(
      'DELETE',
      this.apiUrl,
      {
        body: {
          reason: reason.trim()
        }
      }
    );

  }

}