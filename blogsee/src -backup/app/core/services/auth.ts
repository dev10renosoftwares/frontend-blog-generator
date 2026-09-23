import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  BehaviorSubject,
  throwError
} from 'rxjs';

import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment.development';

import { AuthResponseDto } from '../../ServiceModels/v1/Authentication/AuthResponseDto';
import { RegisterRequestDto } from '../../ServiceModels/v1/Authentication/RegisterRequestDto';
import { LoginRequestDto } from '../../ServiceModels/v1/Authentication/LoginRequestDto';
import { RefreshTokenRequestDto } from '../../ServiceModels/v1/Authentication/RefreshTokenRequestDto';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ============================================================
  // API URL
  // ============================================================

  private readonly apiUrl =
    `${environment.apiUrl}/Auth`;


  // ============================================================
  // USERNAME STATE
  // ============================================================

  private usernameSubject =
    new BehaviorSubject<string>(
      localStorage.getItem('username') || ''
    );

  username$ =
    this.usernameSubject.asObservable();


  // ============================================================
  // USER INFORMATION
  // ============================================================

  public username =
    localStorage.getItem('username') || '';

  public userEmail =
    localStorage.getItem('userEmail') || '';

  public showAuthRequired = false;


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private http: HttpClient
  ) {

    this.restoreUser();

  }


  // ============================================================
  // RESTORE USER
  // ============================================================

  private restoreUser(): void {

    const savedUsername =
      localStorage.getItem('username');

    const savedEmail =
      localStorage.getItem('userEmail');

    const savedUser =
      localStorage.getItem('user');


    // ----------------------------------------------------------
    // Restore username
    // ----------------------------------------------------------

    if (savedUsername) {

      this.username =
        savedUsername;

      this.usernameSubject.next(
        savedUsername
      );

    }


    // ----------------------------------------------------------
    // Restore email
    // ----------------------------------------------------------

    if (savedEmail) {

      this.userEmail =
        savedEmail;

    }


    // ----------------------------------------------------------
    // Restore complete user
    // ----------------------------------------------------------

    if (savedUser) {

      try {

        const parsedUser =
          JSON.parse(savedUser);


        /*
         * Backend authentication response:
         *
         * {
         *   accessToken: "...",
         *   refreshToken: "...",
         *   user: {
         *     userName: "...",
         *     email: "..."
         *   }
         * }
         *
         * Therefore the actual user can be:
         *
         * savedUser.user
         *
         */

        const user =
          parsedUser?.user || parsedUser;


        const restoredUsername =
          user?.userName ||
          user?.username ||
          savedUsername ||
          '';


        const restoredEmail =
          user?.email ||
          savedEmail ||
          '';


        if (restoredUsername) {

          this.username =
            restoredUsername;

          localStorage.setItem(
            'username',
            restoredUsername
          );

          this.usernameSubject.next(
            restoredUsername
          );

        }


        if (restoredEmail) {

          this.userEmail =
            restoredEmail;

          localStorage.setItem(
            'userEmail',
            restoredEmail
          );

        }

      }
      catch (error) {

        console.error(
          'Error restoring saved user:',
          error
        );

      }

    }

  }


  // ============================================================
  // LOGIN
  // ============================================================

  login(
    email: string,
    password: string
  ): Observable<AuthResponseDto> {


    const loginRequest:
      LoginRequestDto = {

        email: email,

        password: password

      };


    return this.http
      .post<AuthResponseDto>(
        `${this.apiUrl}/login`,
        loginRequest
      )
      .pipe(

        tap(
          (response: AuthResponseDto) => {

            console.log(
              'LOGIN RESPONSE:',
              response
            );


            this.saveAuthentication(
              response,
              email
            );

          }
        )

      );

  }


  // ============================================================
  // REGISTER
  // ============================================================

  register(
    username: string,
    email: string,
    password: string
  ): Observable<AuthResponseDto> {


    const registerRequest:
      RegisterRequestDto = {

        userName: username,

        email: email,

        password: password

      };


    return this.http
      .post<AuthResponseDto>(
        `${this.apiUrl}/register`,
        registerRequest
      )
      .pipe(

        tap(
          (response: AuthResponseDto) => {

            console.log(
              'REGISTER RESPONSE:',
              response
            );


            /*
             * Registration already returns:
             *
             * accessToken
             * refreshToken
             * user
             *
             * Therefore registration
             * automatically logs the user in.
             */

            this.saveAuthentication(
              response,
              email,
              username
            );

          }
        )

      );

  }


  // ============================================================
  // SAVE AUTHENTICATION
  // ============================================================

private saveAuthentication(
  response: AuthResponseDto,
  fallbackEmail: string = '',
  fallbackUsername: string = ''
): void {

  const accessToken = response?.accessToken || '';
  const refreshToken = response?.refreshToken || '';
  const expiresAt = response?.expiresAt || '';

  const username =
    response?.userName ||
    fallbackUsername ||
    '';

  const email =
    response?.email ||
    fallbackEmail ||
    '';

  const availableCredits =
    response?.availableCredits;

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  if (expiresAt) {
    localStorage.setItem('expiresAt', expiresAt);
  }

  if (username) {
    this.username = username;
    localStorage.setItem('username', username);
    this.usernameSubject.next(username);
  }

  if (email) {
    this.userEmail = email;
    localStorage.setItem('userEmail', email);
  }

  localStorage.setItem('user', JSON.stringify(response));

  if (availableCredits !== undefined) {
    localStorage.setItem(
      'availableCredits',
      String(availableCredits)
    );
  }

  console.log('AUTHENTICATION SAVED:', {
    username: username,
    email: email,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    availableCredits: availableCredits
  });
}


  // ============================================================
  // REFRESH TOKEN
  // ============================================================

 refreshToken(): Observable<AuthResponseDto> {

  const savedRefreshToken =
    localStorage.getItem('refreshToken');

  if (!savedRefreshToken) {
    console.error('REFRESH TOKEN NOT FOUND');

    return throwError(
      () => new Error('Refresh token not found.')
    );
  }

  const refreshRequest: RefreshTokenRequestDto = {
    refreshToken: savedRefreshToken
  };

  return this.http
    .post<AuthResponseDto>(
      `${this.apiUrl}/refresh-token`,
      refreshRequest
    )
    .pipe(
      tap((response: AuthResponseDto) => {

        console.log('REFRESH RESPONSE:', response);

        if (response?.accessToken) {
          localStorage.setItem(
            'accessToken',
            response.accessToken
          );
        }

        if (response?.refreshToken) {
          localStorage.setItem(
            'refreshToken',
            response.refreshToken
          );
        }

        if (response?.expiresAt) {
          localStorage.setItem(
            'expiresAt',
            response.expiresAt
          );
        }

        console.log(
          'ACCESS TOKEN REFRESHED SUCCESSFULLY.'
        );
      })
    );
}


  // ============================================================
  // GET ACCESS TOKEN
  // ============================================================

  getToken(): string | null {

    return localStorage.getItem(
      'accessToken'
    );

  }


  // ============================================================
  // GET REFRESH TOKEN
  // ============================================================

  getRefreshToken(): string | null {

    return localStorage.getItem(
      'refreshToken'
    );

  }


  // ============================================================
  // GET USERNAME
  // ============================================================

  getUsername(): string {

    return (
      localStorage.getItem(
        'username'
      ) || ''
    );

  }


  // ============================================================
  // GET EMAIL
  // ============================================================

  getEmail(): string {

    return (
      localStorage.getItem(
        'userEmail'
      ) || ''
    );

  }


  // ============================================================
  // GET EXPIRATION
  // ============================================================

  getExpiresAt(): string | null {

    return localStorage.getItem(
      'expiresAt'
    );

  }


  // ============================================================
  // GET SAVED USER
  // ============================================================

  getUser(): any {

    const savedUser =
      localStorage.getItem('user');


    if (!savedUser) {

      return null;

    }


    try {

      return JSON.parse(
        savedUser
      );

    }
    catch {

      return null;

    }

  }


  // ============================================================
  // CHECK LOGIN
  // ============================================================

  isLoggedIn(): boolean {

    return !!(
      localStorage.getItem(
        'accessToken'
      )
    );

  }


  // ============================================================
  // UPDATE STORED USERNAME
  // ============================================================

  updateStoredUsername(
    newUsername: string
  ): void {


    const username =
      newUsername.trim();


    if (!username) {

      return;

    }


    // ----------------------------------------------------------
    // UPDATE SERVICE
    // ----------------------------------------------------------

    this.username =
      username;


    // ----------------------------------------------------------
    // UPDATE LOCAL STORAGE
    // ----------------------------------------------------------

    localStorage.setItem(
      'username',
      username
    );


    // ----------------------------------------------------------
    // UPDATE SAVED AUTH RESPONSE
    // ----------------------------------------------------------

    const savedUser =
      localStorage.getItem(
        'user'
      );


    if (savedUser) {

      try {

        const response =
          JSON.parse(
            savedUser
          );


        /*
         * The saved authentication
         * response contains:
         *
         * response.user.userName
         */

        if (response?.user) {

          response.user.userName =
            username;

        }
        else {

          response.userName =
            username;

        }


        localStorage.setItem(
          'user',
          JSON.stringify(
            response
          )
        );

      }
      catch (error) {

        console.error(
          'Unable to update saved username:',
          error
        );

      }

    }


    // ----------------------------------------------------------
    // UPDATE NAVBAR
    // ----------------------------------------------------------

    this.usernameSubject.next(
      username
    );

  }


  // ============================================================
  // LOGOUT
  // ============================================================

  logout(): void {


    localStorage.removeItem(
      'accessToken'
    );

    localStorage.removeItem(
      'refreshToken'
    );

    localStorage.removeItem(
      'expiresAt'
    );

    localStorage.removeItem(
      'expiresIn'
    );

    localStorage.removeItem(
      'username'
    );

    localStorage.removeItem(
      'userEmail'
    );

    localStorage.removeItem(
      'user'
    );

    localStorage.removeItem(
      'availableCredits'
    );


    this.username =
      '';

    this.userEmail =
      '';


    this.usernameSubject.next(
      ''
    );


    console.log(
      'USER LOGGED OUT.'
    );

  }


  // ============================================================
  // AUTH REQUIRED
  // ============================================================

  openAuthRequired(): void {

    this.showAuthRequired =
      true;

  }


  closeAuthRequired(): void {

    this.showAuthRequired =
      false;

  }

}