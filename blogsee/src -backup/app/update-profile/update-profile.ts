import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { ProfileService } from '../services/updateprofile';
import { AuthService } from '../core/services/auth';

import { UserProfileDto } from '../ServiceModels/v1/Profile/UserProfileDto';

import { environment } from '../../environments/environment.development';


@Component({
  selector: 'app-update-profile',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],

  templateUrl: './update-profile.html',
  styleUrls: ['./update-profile.css']
})


export class UpdateProfileComponent implements OnInit {

  // ============================================================
  // PROFILE DATA
  // ============================================================

  username: string = '';
  newUsername: string = '';
  email: string = '';

  profilePictureUrl: string | null = null;


  // ============================================================
  // USERNAME
  // ============================================================

  isEditingUsername: boolean = false;
  isSavingUsername: boolean = false;


  // ============================================================
  // PROFILE PICTURE
  // ============================================================

  isUploadingPicture: boolean = false;
  isDeletingPicture: boolean = false;


  // ============================================================
  // PASSWORD
  // ============================================================

  showPasswordOverlay: boolean = false;
  isChangingPassword: boolean = false;

  passwordForm!: FormGroup;


  // ============================================================
  // ACCOUNT
  // ============================================================

  isDeletingAccount: boolean = false;


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) { }


  // ============================================================
  // INITIALIZATION
  // ============================================================

  ngOnInit(): void {

    this.passwordForm = this.fb.group({

      oldPassword: [
        '',
        [
          Validators.required
        ]
      ],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]

    });

    this.loadProfile();
  }


  // ============================================================
  // PASSWORD VALIDATION
  // ============================================================

  get passwordsAreSame(): boolean {

    const newPassword =
      this.passwordForm?.get('newPassword')?.value;

    const confirmPassword =
      this.passwordForm?.get('confirmPassword')?.value;

    return (
      newPassword !== '' &&
      confirmPassword !== '' &&
      newPassword === confirmPassword
    );
  }


  get passwordsDoNotMatch(): boolean {

    const newPassword =
      this.passwordForm?.get('newPassword')?.value;

    const confirmPassword =
      this.passwordForm?.get('confirmPassword')?.value;

    return (
      newPassword !== '' &&
      confirmPassword !== '' &&
      newPassword !== confirmPassword
    );
  }


  // ============================================================
  // LOAD PROFILE
  // ============================================================

  loadProfile(): void {

    console.log('LOADING PROFILE...');


    // ==========================================================
    // CHECK ACCESS TOKEN
    // ==========================================================

    const token =
      this.authService.getToken();

    console.log(
      'ACCESS TOKEN EXISTS:',
      !!token
    );


    if (!token) {

      console.error(
        'NO ACCESS TOKEN FOUND.'
      );

      alert(
        'Your session has expired. Please login again.'
      );

      this.authService.logout();

      this.router.navigate(['/login']);

      return;
    }


    // ==========================================================
    // CALL PROFILE API
    // ==========================================================

    this.profileService
      .getProfile()
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: UserProfileDto) => {

          console.log(
            'PROFILE API RESPONSE:',
            response
          );


          if (!response) {

            console.error(
              'PROFILE RESPONSE IS EMPTY.'
            );

            alert(
              'Unable to load your profile.'
            );

            return;
          }


          // ======================================================
          // USERNAME
          // ======================================================

          this.username =
            response.userName || '';

          this.newUsername =
            this.username;


          // ======================================================
          // EMAIL
          // ======================================================

          this.email =
            response.email || '';


          // ======================================================
          // PROFILE PICTURE
          // ======================================================

          this.profilePictureUrl =
            this.buildProfilePictureUrl(
              response.profilePictureUrl
            );


          // ======================================================
          // SAVE USERNAME
          // ======================================================

          if (this.username) {

            localStorage.setItem(
              'username',
              this.username
            );

            this.authService.updateStoredUsername(
              this.username
            );
          }


          // ======================================================
          // SAVE EMAIL
          // ======================================================

          if (this.email) {

            localStorage.setItem(
              'userEmail',
              this.email
            );
          }


          // ======================================================
          // SAVE AVAILABLE CREDITS
          // ======================================================

          if (
            response.availableCredits !== undefined &&
            response.availableCredits !== null
          ) {

            localStorage.setItem(
              'availableCredits',
              String(response.availableCredits)
            );
          }


          // ======================================================
          // SAVE COMPLETE PROFILE
          // ======================================================

          localStorage.setItem(
            'user',
            JSON.stringify(response)
          );


          // ======================================================
          // DEBUG
          // ======================================================

          console.log(
            'USERNAME:',
            this.username
          );

          console.log(
            'EMAIL:',
            this.email
          );

          console.log(
            'AVAILABLE CREDITS:',
            response.availableCredits
          );

          console.log(
            'PROFILE PICTURE:',
            response.profilePictureUrl
          );

        },


        // ========================================================
        // ERROR
        // ========================================================

        error: (error: any) => {

          console.error(
            'GET PROFILE ERROR:',
            error
          );

          console.error(
            'HTTP STATUS:',
            error?.status
          );

          console.error(
            'ERROR BODY:',
            error?.error
          );


          // ======================================================
          // 401 = UNAUTHORIZED
          // ======================================================

          if (error?.status === 401) {

            alert(
              'Your session has expired. Please login again.'
            );

            this.authService.logout();

            this.router.navigate(['/login']);

            return;
          }


          // ======================================================
          // OTHER ERROR
          // ======================================================

          alert(
            error?.error?.message ??
            'Unable to load your profile.'
          );

        }

      });

  }


  // ============================================================
  // PROFILE PICTURE URL
  // ============================================================

  private buildProfilePictureUrl(
    pictureUrl: string | null | undefined
  ): string | null {

    if (!pictureUrl) {
      return null;
    }


    const url =
      String(pictureUrl).trim();


    if (!url) {
      return null;
    }


    // ==========================================================
    // ALREADY A COMPLETE URL
    // ==========================================================

    if (
      url.startsWith('http://') ||
      url.startsWith('https://')
    ) {

      return url;
    }


    // ==========================================================
    // REMOVE /api/v1 FROM API URL
    // ==========================================================

    const serverUrl =
      environment.apiUrl.replace(
        '/api/v1',
        ''
      );


    // ==========================================================
    // BACKEND RETURNED:
    //
    // /ProfilePictures/abc.jpg
    // ==========================================================

    if (url.startsWith('/')) {

      return (
        serverUrl +
        url
      );
    }


    // ==========================================================
    // BACKEND RETURNED:
    //
    // ProfilePictures/abc.jpg
    // ==========================================================

    return (
      serverUrl +
      '/' +
      url
    );
  }


  // ============================================================
  // USERNAME EDIT
  // ============================================================

  editUsername(): void {

    this.newUsername =
      this.username;

    this.isEditingUsername =
      true;
  }


  cancelUsernameEdit(): void {

    this.newUsername =
      this.username;

    this.isEditingUsername =
      false;
  }


  // ============================================================
  // SAVE USERNAME
  // ============================================================

  saveUsername(): void {

    const username =
      this.newUsername.trim();


    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!username) {

      alert(
        'Username cannot be empty.'
      );

      return;
    }


    if (username.length < 3) {

      alert(
        'Username must contain at least 3 characters.'
      );

      return;
    }


    if (username === this.username) {

      this.isEditingUsername =
        false;

      return;
    }


    // ==========================================================
    // PREVENT DOUBLE CLICK
    // ==========================================================

    if (this.isSavingUsername) {
      return;
    }


    this.isSavingUsername =
      true;


    // ==========================================================
    // UPDATE PROFILE
    // ==========================================================

    this.profileService
      .updateProfile(username)
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: any) => {

          console.log(
            'UPDATE PROFILE RESPONSE:',
            response
          );


          /*
           * The backend update-profile response
           * does not return the updated user object.
           *
           * We already know the username because
           * we sent it in the request.
           */

          const updatedUsername =
            username;


          // ======================================================
          // UPDATE PAGE
          // ======================================================

          this.username =
            updatedUsername;

          this.newUsername =
            updatedUsername;

          this.isEditingUsername =
            false;


          // ======================================================
          // UPDATE AUTH SERVICE
          // ======================================================

          this.authService.updateStoredUsername(
            updatedUsername
          );


          // ======================================================
          // UPDATE LOCAL STORAGE
          // ======================================================

          localStorage.setItem(
            'username',
            updatedUsername
          );


          // ======================================================
          // FINISHED
          // ======================================================

          this.isSavingUsername =
            false;


          alert(
            'Username updated successfully.'
          );
        },


        // ========================================================
        // ERROR
        // ========================================================

        error: (error: any) => {

          console.error(
            'UPDATE USERNAME ERROR:',
            error
          );


          this.isSavingUsername =
            false;


          if (error?.status === 400) {

            alert(
              error?.error?.message ??
              'Invalid username.'
            );
          }

          else if (error?.status === 401) {

            alert(
              'Your session has expired. Please login again.'
            );

            this.authService.logout();

            this.router.navigate(['/login']);
          }

          else {

            alert(
              error?.error?.message ??
              'Unable to update username.'
            );
          }

        }

      });

  }


  // ============================================================
  // PROFILE PICTURE - FILE SELECT
  // ============================================================

  onProfilePictureSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;
    }


    const file =
      input.files[0];


    // ==========================================================
    // VALIDATE FILE TYPE
    // ==========================================================

    if (!file.type.startsWith('image/')) {

      alert(
        'Please select an image file.'
      );

      input.value = '';

      return;
    }


    // ==========================================================
    // MAXIMUM 5 MB
    // ==========================================================

    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {

      alert(
        'Profile picture must be smaller than 5 MB.'
      );

      input.value = '';

      return;
    }


    this.uploadProfilePicture(
      file,
      input
    );
  }


  // ============================================================
  // UPLOAD PROFILE PICTURE
  // ============================================================

  private uploadProfilePicture(
    file: File,
    input: HTMLInputElement
  ): void {

    if (this.isUploadingPicture) {
      return;
    }


    this.isUploadingPicture =
      true;


    this.profileService
      .uploadProfilePicture(file)
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: any) => {

          console.log(
            'UPLOAD PICTURE RESPONSE:',
            response
          );


          /*
           * Get the URL returned by the backend.
           */

          const returnedUrl =
            response?.data?.profilePictureUrl ??
            response?.data?.pictureUrl ??
            response?.profilePictureUrl ??
            response?.pictureUrl ??
            null;


          if (!returnedUrl) {

            console.error(
              'Backend did not return a profile picture URL.',
              response
            );

            this.isUploadingPicture =
              false;

            input.value = '';

            alert(
              'Picture was uploaded, but the server did not return its URL.'
            );

            return;
          }


          // ======================================================
          // BUILD FINAL IMAGE URL
          // ======================================================

          const imageUrl =
            this.buildProfilePictureUrl(
              returnedUrl
            );


          console.log(
            'FINAL PROFILE PICTURE URL:',
            imageUrl
          );


          // ======================================================
          // PREVENT IMAGE CACHE
          // ======================================================

          this.profilePictureUrl =
            imageUrl
              ? `${imageUrl}?t=${Date.now()}`
              : null;


          this.isUploadingPicture =
            false;


          input.value = '';


          alert(
            'Profile picture updated successfully.'
          );

        },


        // ========================================================
        // ERROR
        // ========================================================

        error: (error: any) => {

          console.error(
            'UPLOAD PROFILE PICTURE ERROR:',
            error
          );


          this.isUploadingPicture =
            false;

          input.value = '';


          if (error?.status === 401) {

            alert(
              'Your session has expired. Please login again.'
            );

            this.authService.logout();

            this.router.navigate(['/login']);

          }

          else if (error?.status === 400) {

            alert(
              error?.error?.message ??
              'Invalid profile picture.'
            );

          }

          else {

            alert(
              error?.error?.message ??
              'Unable to upload profile picture.'
            );
          }

        }

      });

  }


  // ============================================================
  // PROFILE PICTURE - REMOVE
  // ============================================================

  deleteProfilePicture(): void {

    if (this.isDeletingPicture) {
      return;
    }


    if (!this.profilePictureUrl) {

      alert(
        'You do not have a profile picture.'
      );

      return;
    }


    const confirmed =
      confirm(
        'Are you sure you want to remove your profile picture?'
      );


    if (!confirmed) {
      return;
    }


    this.isDeletingPicture =
      true;


    this.profileService
      .deleteProfilePicture()
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: any) => {

          console.log(
            'DELETE PICTURE RESPONSE:',
            response
          );


          this.profilePictureUrl =
            null;


          this.isDeletingPicture =
            false;


          alert(
            'Profile picture removed successfully.'
          );


          /*
           * Reload profile so the rest of the
           * profile data stays synchronized.
           */

          this.loadProfile();

        },


        // ========================================================
        // ERROR
        // ========================================================

        error: (error: any) => {

          console.error(
            'DELETE PROFILE PICTURE ERROR:',
            error
          );


          this.isDeletingPicture =
            false;


          if (error?.status === 401) {

            alert(
              'Your session has expired. Please login again.'
            );

            this.authService.logout();

            this.router.navigate(['/login']);

          }

          else {

            alert(
              error?.error?.message ??
              'Unable to remove profile picture.'
            );
          }

        }

      });

  }


  // ============================================================
  // PASSWORD MODAL
  // ============================================================

  openPasswordOverlay(): void {

    this.passwordForm.reset();

    this.showPasswordOverlay =
      true;
  }


  closePasswordOverlay(): void {

    if (this.isChangingPassword) {
      return;
    }


    this.showPasswordOverlay =
      false;

    this.passwordForm.reset();
  }


  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  savePassword(): void {

    if (this.isChangingPassword) {
      return;
    }


    // ==========================================================
    // VALIDATE FORM
    // ==========================================================

    if (
      this.passwordForm.invalid
    ) {

      this.passwordForm.markAllAsTouched();

      return;
    }


    const oldPassword =
      this.passwordForm
        .get('oldPassword')
        ?.value;


    const newPassword =
      this.passwordForm
        .get('newPassword')
        ?.value;


    const confirmPassword =
      this.passwordForm
        .get('confirmPassword')
        ?.value;


    // ==========================================================
    // NEW PASSWORD CANNOT BE SAME AS OLD
    // ==========================================================

    if (
      oldPassword === newPassword
    ) {

      alert(
        'New password must be different from your current password.'
      );

      return;
    }


    // ==========================================================
    // CONFIRM PASSWORD
    // ==========================================================

    if (
      newPassword !== confirmPassword
    ) {

      alert(
        'New password and confirm password do not match.'
      );

      return;
    }


    this.isChangingPassword =
      true;


    this.profileService
      .changePassword(
        oldPassword,
        newPassword,
        confirmPassword
      )
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: any) => {

          console.log(
            'CHANGE PASSWORD RESPONSE:',
            response
          );


          this.isChangingPassword =
            false;


          this.showPasswordOverlay =
            false;


          this.passwordForm.reset();


          alert(
            'Password changed successfully.'
          );
        },


        // ========================================================
        // ERROR
        // ========================================================

        error: (error: any) => {

          console.error(
            'CHANGE PASSWORD ERROR:',
            error
          );


          this.isChangingPassword =
            false;


          if (error?.status === 400) {

            alert(
              error?.error?.message ??
              'The current password is incorrect or the password data is invalid.'
            );
          }

          else if (error?.status === 401) {

            alert(
              'Your session has expired. Please login again.'
            );

            this.authService.logout();

            this.router.navigate(['/login']);

          }

          else if (error?.status === 500) {

            alert(
              'The server encountered an error while changing the password. Please check the backend ChangePassword DTO/service.'
            );

          }

          else {

            alert(
              error?.error?.message ??
              'Unable to change password.'
            );
          }

        }

      });

  }


  // ============================================================
  // DELETE ACCOUNT
  // ============================================================

  deleteAccount(): void {

    if (this.isDeletingAccount) {
      return;
    }


    const confirmed =
      confirm(
        'Are you sure you want to permanently delete your account? This action cannot be undone.'
      );


    if (!confirmed) {
      return;
    }


    const reason =
      prompt(
        'Please enter a reason for deleting your account:'
      );


    if (reason === null) {
      return;
    }


    this.isDeletingAccount =
      true;


    this.profileService
      .deleteAccount(reason.trim())
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: any) => {

          console.log(
            'DELETE ACCOUNT RESPONSE:',
            response
          );


          this.isDeletingAccount =
            false;


          alert(
            'Your account has been deleted successfully.'
          );


          this.authService.logout();

          this.router.navigate(['/']);

        },


        // ========================================================
        // ERROR
        // ========================================================

        error: (error: any) => {

          console.error(
            'DELETE ACCOUNT ERROR:',
            error
          );


          this.isDeletingAccount =
            false;


          if (error?.status === 401) {

            alert(
              'Your session has expired. Please login again.'
            );

            this.authService.logout();

            this.router.navigate(['/login']);

          }

          else {

            alert(
              error?.error?.message ??
              'Unable to delete your account.'
            );
          }

        }

      });

  }


  // ============================================================
  // IMAGE ERROR
  // ============================================================

  onProfileImageError(): void {

    console.error(
      'Profile picture could not be loaded:',
      this.profilePictureUrl
    );


    this.profilePictureUrl =
      null;
  }


  // ============================================================
  // BACK BUTTON
  // ============================================================

  goBack(): void {

    this.location.back();
  }

}