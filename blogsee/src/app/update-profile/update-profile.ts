
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
import { UpdateProfileRequestDto } from '../ServiceModels/v1/Profile/UpdateProfileRequestDto';
import { ChangePasswordRequestDto } from '../ServiceModels/v1/Profile/ChangePasswordRequestDto';
import { DeleteAccountRequestDto } from '../ServiceModels/v1/Profile/DeleteAccountRequestDto';

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

  isLoadingProfile: boolean = false;


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
  ) {}


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
      this.passwordForm?.get('newPassword')?.value || '';

    const confirmPassword =
      this.passwordForm?.get('confirmPassword')?.value || '';

    return (
      newPassword !== '' &&
      confirmPassword !== '' &&
      newPassword === confirmPassword
    );
  }


  get passwordsDoNotMatch(): boolean {

    const newPassword =
      this.passwordForm?.get('newPassword')?.value || '';

    const confirmPassword =
      this.passwordForm?.get('confirmPassword')?.value || '';

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

    /*
     * We do not manually show "session expired".
     *
     * The AuthInterceptor is responsible for attaching
     * the access token and refreshing it when necessary.
     *
     * If the user is genuinely not logged in, we simply
     * return them to the login page.
     */

    if (!this.authService.isLoggedIn()) {

      console.log(
        'USER IS NOT LOGGED IN.'
      );

      this.router.navigate(['/']);

      return;
    }


    this.isLoadingProfile = true;


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

          this.isLoadingProfile = false;


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
          // UPDATE AUTH SERVICE
          // ======================================================

          if (this.username) {

            this.authService.updateStoredUsername(
              this.username
            );
          }


          // ======================================================
          // UPDATE LOCAL STORAGE - USERNAME
          // ======================================================

          if (this.username) {

            localStorage.setItem(
              'username',
              this.username
            );
          }


          // ======================================================
          // UPDATE LOCAL STORAGE - EMAIL
          // ======================================================

          if (this.email) {

            localStorage.setItem(
              'userEmail',
              this.email
            );
          }


          // ======================================================
          // UPDATE LOCAL STORAGE - CREDITS
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

          this.isLoadingProfile = false;

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


          /*
           * Only redirect when the final request is actually
           * unauthorized.
           *
           * The interceptor gets the first chance to refresh
           * the token before this error reaches the component.
           */

          if (error?.status === 401) {

            this.authService.logout();

            this.router.navigate(['/']);

            return;
          }


          alert(
            error?.error?.message ||
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
    // ALREADY COMPLETE URL
    // ==========================================================

    if (
      url.startsWith('http://') ||
      url.startsWith('https://')
    ) {

      return url;
    }


    // ==========================================================
    // GET SERVER URL
    // ==========================================================

    const serverUrl =
      environment.apiUrl.replace(
        '/api/v1',
        ''
      );


    // ==========================================================
    // BACKEND RETURNS:
    // /ProfilePictures/example.jpg
    // ==========================================================

    if (url.startsWith('/')) {

      return (
        serverUrl +
        url
      );
    }


    // ==========================================================
    // BACKEND RETURNS:
    // ProfilePictures/example.jpg
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
    // BUILD DTO
    // ==========================================================

    const request: UpdateProfileRequestDto = {

      userName: username

    };


    // ==========================================================
    // CALL API
    // ==========================================================

    this.profileService
      .updateProfile(request)
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: unknown) => {

          console.log(
            'UPDATE PROFILE RESPONSE:',
            response
          );


          /*
           * The backend does not return the updated username.
           *
           * We already know the username because it is the
           * username that we sent in the request.
           */

          this.username =
            username;

          this.newUsername =
            username;

          this.isEditingUsername =
            false;


          // ======================================================
          // UPDATE AUTH SERVICE
          // ======================================================

          this.authService.updateStoredUsername(
            username
          );


          // ======================================================
          // UPDATE LOCAL STORAGE
          // ======================================================

          localStorage.setItem(
            'username',
            username
          );


          // ======================================================
          // UPDATE SAVED USER OBJECT
          // ======================================================

          const savedUser =
            localStorage.getItem('user');


          if (savedUser) {

            try {

              const user =
                JSON.parse(savedUser);

              user.userName =
                username;

              localStorage.setItem(
                'user',
                JSON.stringify(user)
              );

            }
            catch {

              console.warn(
                'Could not update saved user object.'
              );

            }

          }


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
              error?.error?.message ||
              'Invalid username.'
            );

          }

          else if (error?.status === 401) {

            this.authService.logout();

            this.router.navigate(['/']);

          }

          else {

            alert(
              error?.error?.message ||
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
    // FILE TYPE
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

        next: (response) => {

          console.log(
            'UPLOAD PICTURE RESPONSE:',
            response
          );


          this.isUploadingPicture =
            false;

          input.value = '';


          /*
           * UploadProfilePictureResponseDto contains:
           *
           * profilePictureUrl
           *
           * directly.
           */

          const imageUrl =
            this.buildProfilePictureUrl(
              response?.profilePictureUrl
            );


          if (!imageUrl) {

            alert(
              'Picture was uploaded, but the server did not return its URL.'
            );

            return;
          }


          // ======================================================
          // UPDATE IMAGE
          // ======================================================

          this.profilePictureUrl =
            `${imageUrl}?t=${Date.now()}`;


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

            this.authService.logout();

            this.router.navigate(['/']);

          }

          else if (error?.status === 400) {

            alert(
              error?.error?.message ||
              'Invalid profile picture.'
            );

          }

          else {

            alert(
              error?.error?.message ||
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

        next: (response: unknown) => {

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
           * Reload profile so all profile data
           * stays synchronized.
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

            this.authService.logout();

            this.router.navigate(['/']);

          }

          else {

            alert(
              error?.error?.message ||
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
    // FORM VALIDATION
    // ==========================================================

    if (this.passwordForm.invalid) {

      this.passwordForm.markAllAsTouched();

      return;
    }


    const currentPassword =
      this.passwordForm
        .get('oldPassword')
        ?.value || '';


    const newPassword =
      this.passwordForm
        .get('newPassword')
        ?.value || '';


    const confirmNewPassword =
      this.passwordForm
        .get('confirmPassword')
        ?.value || '';


    // ==========================================================
    // OLD AND NEW PASSWORD CANNOT BE SAME
    // ==========================================================

    if (
      currentPassword === newPassword
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
      newPassword !== confirmNewPassword
    ) {

      alert(
        'New password and confirm password do not match.'
      );

      return;
    }


    // ==========================================================
    // BUILD DTO
    // ==========================================================

    const request: ChangePasswordRequestDto = {

      currentPassword:
        currentPassword,

      newPassword:
        newPassword,

      confirmNewPassword:
        confirmNewPassword

    };


    // ==========================================================
    // CHANGE PASSWORD
    // ==========================================================

    this.isChangingPassword =
      true;


    this.profileService
      .changePassword(request)
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: unknown) => {

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
              error?.error?.message ||
              'The current password is incorrect or the password data is invalid.'
            );

          }

          else if (error?.status === 401) {

            this.authService.logout();

            this.router.navigate(['/']);

          }

          else if (error?.status === 500) {

            alert(
              'The server encountered an error while changing the password.'
            );

          }

          else {

            alert(
              error?.error?.message ||
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


    // ==========================================================
    // BUILD DTO
    // ==========================================================

    const request: DeleteAccountRequestDto = {

      reason:
        reason.trim()

    };


    // ==========================================================
    // DELETE ACCOUNT
    // ==========================================================

    this.isDeletingAccount =
      true;


    this.profileService
      .deleteAccount(request)
      .subscribe({

        // ========================================================
        // SUCCESS
        // ========================================================

        next: (response: unknown) => {

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

            this.authService.logout();

            this.router.navigate(['/']);

          }

          else {

            alert(
              error?.error?.message ||
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

