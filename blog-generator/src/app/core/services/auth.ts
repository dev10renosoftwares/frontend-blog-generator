import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://192.168.29.71:5229/api/v1/Auth';

  // =========================
  // USER STATE
  // =========================

  private usernameSubject = new BehaviorSubject<string>(
    localStorage.getItem('username') || ''
  );

  username$ = this.usernameSubject.asObservable();

  public username = '';
  public userEmail = '';

  public showAuthRequired = false;


  constructor(private http: HttpClient) {

    // Restore user after page refresh
    const savedUsername = localStorage.getItem('username');

    if (savedUsername) {
      this.username = savedUsername;
      this.usernameSubject.next(savedUsername);
    }

    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        this.username =
          user.username ||
          user.userName ||
          savedUsername ||
          '';

        this.userEmail =
          user.email ||
          '';

        this.usernameSubject.next(this.username);

      } catch (error) {
        console.error('Error loading saved user:', error);
      }
    }
  }


  // =========================
  // LOGIN
  // =========================

  login(
    email: string,
    password: string
  ): Observable<any> {

    const loginData = {
      email: email,
      password: password
    };

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      loginData
    ).pipe(

      tap((response) => {

        console.log('LOGIN RESPONSE:', response);

        /*
         * Supports:
         * response.data.user
         * response.user
         */

        const responseData =
          response.data || response;

        const user =
          responseData.user || responseData;


        // Username
        this.username =
          user.username ||
          user.userName ||
          '';


        // Email
        this.userEmail =
          user.email ||
          email;


        // Access token
        const accessToken =
          response.accessToken ||
          responseData.accessToken;


        // Refresh token
        const refreshToken =
          response.refreshToken ||
          responseData.refreshToken;


        // Save access token
        if (accessToken) {

          localStorage.setItem(
            'accessToken',
            accessToken
          );

        }


        // Save refresh token
        if (refreshToken) {

          localStorage.setItem(
            'refreshToken',
            refreshToken
          );

        }


        // Save username
        localStorage.setItem(
          'username',
          this.username
        );


        // Save email
        localStorage.setItem(
          'userEmail',
          this.userEmail
        );


        // Save user
        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );


        // Tell navbar that username changed
        this.usernameSubject.next(
          this.username
        );


        console.log(
          'Logged in user:',
          this.username
        );

      })
    );
  }


  // =========================
  // REGISTER
  // =========================

  register(
    username: string,
    email: string,
    password: string
  ): Observable<any> {

    const registerData = {
      username: username,
      email: email,
      password: password
    };


    console.log(
      'Sending registration:',
      registerData
    );


    return this.http.post<any>(
      `${this.apiUrl}/register`,
      registerData
    ).pipe(

      tap((response) => {

        console.log(
          'REGISTRATION RESPONSE:',
          response
        );


        /*
         * Supports both:
         *
         * response.user
         *
         * response.data.user
         */

        const responseData =
          response.data || response;

        const user =
          responseData.user || responseData;


        // =========================
        // USERNAME
        // =========================

        this.username =
          user.username ||
          user.userName ||
          username;


        // =========================
        // EMAIL
        // =========================

        this.userEmail =
          user.email ||
          email;


        // =========================
        // TOKENS
        // =========================

        const accessToken =
          response.accessToken ||
          responseData.accessToken;

        const refreshToken =
          response.refreshToken ||
          responseData.refreshToken;


        if (accessToken) {

          localStorage.setItem(
            'accessToken',
            accessToken
          );

        }


        if (refreshToken) {

          localStorage.setItem(
            'refreshToken',
            refreshToken
          );

        }


        // =========================
        // SAVE USER
        // =========================

        localStorage.setItem(
          'username',
          this.username
        );

        localStorage.setItem(
          'userEmail',
          this.userEmail
        );

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );


        // =========================
        // UPDATE NAVBAR
        // =========================

        this.usernameSubject.next(
          this.username
        );


        console.log(
          'Registered username:',
          this.username
        );

      })
    );
  }


  // =========================
  // LOGIN CHECK
  // =========================

  isLoggedIn(): boolean {

    return !!localStorage.getItem(
      'accessToken'
    );
  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    this.username = '';
    this.userEmail = '';

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');

    this.usernameSubject.next('');
  }


  // =========================
  // AUTH REQUIRED
  // =========================

  openAuthRequired(): void {
    this.showAuthRequired = true;
  }


  closeAuthRequired(): void {
    this.showAuthRequired = false;
  }

}