import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
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

  private readonly apiUrl = `${environment.apiUrl}/Auth`;

  private usernameSubject = new BehaviorSubject<string>(
    localStorage.getItem('username') || ''
  );

  username$ = this.usernameSubject.asObservable();

  public username = localStorage.getItem('username') || '';
  public userEmail = localStorage.getItem('userEmail') || '';
  public showAuthRequired = false;

  constructor(private http: HttpClient) {
    this.restoreUser();
  }

  private restoreUser(): void {
    const savedUsername = localStorage.getItem('username') || '';
    const savedEmail = localStorage.getItem('userEmail') || '';
    const savedUser = localStorage.getItem('user');

    if (savedUsername) {
      this.username = savedUsername;
      this.usernameSubject.next(savedUsername);
    }

    if (savedEmail) {
      this.userEmail = savedEmail;
    }

    if (!savedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      const user = parsedUser?.user || parsedUser?.data?.user || parsedUser?.data || parsedUser;

      const restoredUsername =
        user?.userName || user?.username || parsedUser?.userName || parsedUser?.username || savedUsername;

      const restoredEmail =
        user?.email || parsedUser?.email || savedEmail;

      if (restoredUsername) {
        this.username = restoredUsername;
        localStorage.setItem('username', restoredUsername);
        this.usernameSubject.next(restoredUsername);
      }

      if (restoredEmail) {
        this.userEmail = restoredEmail;
        localStorage.setItem('userEmail', restoredEmail);
      }
    } catch (error) {
      console.error('Unable to restore saved user:', error);
    }
  }

  login(email: string, password: string): Observable<AuthResponseDto> {
    const request: LoginRequestDto = { email, password };

    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => this.saveAuthentication(response, email))
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponseDto> {
    const request: RegisterRequestDto = {
      userName: username,
      email,
      password
    };

    return this.http.post<AuthResponseDto>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => this.saveAuthentication(response, email, username))
    );
  }

private saveAuthentication(
  response: AuthResponseDto,
  fallbackEmail: string = '',
  fallbackUsername: string = ''
): void {

  // ============================================================
  // SUPPORT BOTH RESPONSE FORMATS
  // ============================================================

  // Format 1:
  // {
  //   accessToken: "...",
  //   refreshToken: "...",
  //   user: { ... }
  // }

  // Format 2:
  // {
  //   data: {
  //     accessToken: "...",
  //     refreshToken: "...",
  //     user: { ... }
  //   }
  // }

  const responseData: any =
    (response as any)?.data ??
    response;


  // ============================================================
  // USER OBJECT
  // ============================================================

  const user: any =
    responseData?.user ??
    responseData?.User ??
    responseData;


  // ============================================================
  // TOKENS
  // ============================================================

  const accessToken: string =
    responseData?.accessToken ??
    responseData?.AccessToken ??
    (response as any)?.accessToken ??
    (response as any)?.AccessToken ??
    '';

  const refreshToken: string =
    responseData?.refreshToken ??
    responseData?.RefreshToken ??
    (response as any)?.refreshToken ??
    (response as any)?.RefreshToken ??
    '';

  const expiresAt: string =
    responseData?.expiresAt ??
    responseData?.ExpiresAt ??
    (response as any)?.expiresAt ??
    (response as any)?.ExpiresAt ??
    '';


  // ============================================================
  // USERNAME
  // ============================================================

  const username: string =
    user?.userName ??
    user?.UserName ??
    user?.username ??
    user?.Username ??
    responseData?.userName ??
    responseData?.UserName ??
    fallbackUsername ??
    '';


  // ============================================================
  // EMAIL
  // ============================================================

  const email: string =
    user?.email ??
    user?.Email ??
    responseData?.email ??
    responseData?.Email ??
    fallbackEmail ??
    '';


  // ============================================================
  // AVAILABLE CREDITS
  // ============================================================

  const availableCredits =
    user?.availableCredits ??
    user?.AvailableCredits ??
    responseData?.availableCredits ??
    responseData?.AvailableCredits;


  // ============================================================
  // SAVE ACCESS TOKEN
  // ============================================================

  if (accessToken) {

    localStorage.setItem(
      'accessToken',
      accessToken
    );

  }


  // ============================================================
  // SAVE REFRESH TOKEN
  // ============================================================

  if (refreshToken) {

    localStorage.setItem(
      'refreshToken',
      refreshToken
    );

  }


  // ============================================================
  // SAVE EXPIRATION
  // ============================================================

  if (expiresAt) {

    localStorage.setItem(
      'expiresAt',
      expiresAt
    );

  }
  else if (
    responseData?.expiresIn !== undefined &&
    responseData?.expiresIn !== null
  ) {

    const expiresInSeconds =
      Number(
        responseData.expiresIn
      );

    if (
      !Number.isNaN(
        expiresInSeconds
      )
    ) {

      localStorage.setItem(
        'expiresAt',
        new Date(
          Date.now() +
          expiresInSeconds * 1000
        ).toISOString()
      );

    }

  }


  // ============================================================
  // SAVE USERNAME
  // ============================================================

  if (username) {

    this.username =
      username;

    localStorage.setItem(
      'username',
      username
    );

    this.usernameSubject.next(
      username
    );

  }


  // ============================================================
  // SAVE EMAIL
  // ============================================================

  if (email) {

    this.userEmail =
      email;

    localStorage.setItem(
      'userEmail',
      email
    );

  }


  // ============================================================
  // SAVE AVAILABLE CREDITS
  // ============================================================

  if (
    availableCredits !== undefined &&
    availableCredits !== null
  ) {

    localStorage.setItem(
      'availableCredits',
      String(
        availableCredits
      )
    );

  }


  // ============================================================
  // SAVE COMPLETE AUTH RESPONSE
  // ============================================================

  localStorage.setItem(
    'user',
    JSON.stringify(
      response
    )
  );


  // ============================================================
  // DEBUG
  // ============================================================

  console.log(
    'AUTHENTICATION SAVED:',
    {
      username,
      email,
      hasAccessToken:
        !!accessToken,
      hasRefreshToken:
        !!refreshToken,
      availableCredits
    }
  );

}

  refreshToken(): Observable<AuthResponseDto> {
    const savedRefreshToken = localStorage.getItem('refreshToken');

    if (!savedRefreshToken) {
      return throwError(() => new Error('Refresh token not found.'));
    }

    const request: RefreshTokenRequestDto = {
      refreshToken: savedRefreshToken
    };

    return this.http.post<AuthResponseDto>(`${this.apiUrl}/refresh-token`, request).pipe(
      tap((response) => {
        const raw: any = response;
        const newAccessToken = raw?.accessToken || raw?.data?.accessToken || '';
        const newRefreshToken = raw?.refreshToken || raw?.data?.refreshToken || '';

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
        }

        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        if (raw?.expiresAt) {
          localStorage.setItem('expiresAt', raw.expiresAt);
        } else if (raw?.expiresIn !== undefined) {
          localStorage.setItem(
            'expiresAt',
            new Date(Date.now() + Number(raw.expiresIn) * 1000).toISOString()
          );
        }

        console.log('ACCESS TOKEN REFRESHED SUCCESSFULLY.');
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getUsername(): string {
    return localStorage.getItem('username') || this.username || '';
  }

  getEmail(): string {
    return localStorage.getItem('userEmail') || this.userEmail || '';
  }

  getExpiresAt(): string | null {
    return localStorage.getItem('expiresAt');
  }

  getUser(): any {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  updateStoredUsername(newUsername: string): void {
    const username = newUsername.trim();

    if (!username) {
      return;
    }

    this.username = username;
    localStorage.setItem('username', username);

    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        user.userName = username;
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Unable to update saved username:', error);
      }
    }

    this.usernameSubject.next(username);
  }

  updateStoredCredits(credits: number): void {
    const value = Number(credits);

    if (!Number.isNaN(value)) {
      localStorage.setItem('availableCredits', String(value));
    }
  }

  logout(): void {
    [
      'accessToken',
      'refreshToken',
      'expiresAt',
      'expiresIn',
      'username',
      'userEmail',
      'user',
      'availableCredits'
    ].forEach((key) => localStorage.removeItem(key));

    this.username = '';
    this.userEmail = '';
    this.usernameSubject.next('');

    console.log('USER LOGGED OUT.');
  }

  openAuthRequired(): void {
    this.showAuthRequired = true;
  }

  closeAuthRequired(): void {
    this.showAuthRequired = false;
  }
}
