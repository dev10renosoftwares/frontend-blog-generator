
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // =====================================================
  // API URL
  // =====================================================

  private apiUrl =
    'http://192.168.29.71:5229/api/v1/Auth';


  // =====================================================
  // USER STATE
  // =====================================================

  private usernameSubject =
    new BehaviorSubject<string>(
      localStorage.getItem('username') || ''
    );

  username$ =
    this.usernameSubject.asObservable();


  public username =
    localStorage.getItem('username') || '';

  public userEmail =
    localStorage.getItem('userEmail') || '';

  public showAuthRequired = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {

    this.restoreUser();

  }


  // =====================================================
  // RESTORE USER AFTER PAGE REFRESH
  // =====================================================

  private restoreUser(): void {

    const savedUsername =
      localStorage.getItem('username');

    const savedEmail =
      localStorage.getItem('userEmail');

    const savedUser =
      localStorage.getItem('user');


    // -----------------------------
    // Restore username
    // -----------------------------

    if (savedUsername) {

      this.username =
        savedUsername;

      this.usernameSubject.next(
        savedUsername
      );

    }


    // -----------------------------
    // Restore email
    // -----------------------------

    if (savedEmail) {

      this.userEmail =
        savedEmail;

    }


    // -----------------------------
    // Restore complete user
    // -----------------------------

    if (savedUser) {

      try {

        const user =
          JSON.parse(savedUser);


        this.username =
          user.userName ||
          user.username ||
          savedUsername ||
          '';


        this.userEmail =
          user.email ||
          savedEmail ||
          '';


        this.usernameSubject.next(
          this.username
        );


      } catch (error) {

        console.error(
          'Error restoring saved user:',
          error
        );

      }

    }

  }


  // =====================================================
  // LOGIN
  // =====================================================

  login(
    email: string,
    password: string
  ): Observable<any> {

    const loginData = {

      email: email,

      password: password

    };


    console.log(
      'LOGIN REQUEST:',
      loginData
    );


    return this.http.post<any>(
      `${this.apiUrl}/login`,
      loginData
    ).pipe(

      tap((response: any) => {

        console.log(
          'LOGIN RESPONSE:',
          response
        );


        this.saveAuthentication(
          response,
          email
        );

      })

    );

  }


  // =====================================================
  // REGISTER
  // =====================================================

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
      'REGISTER REQUEST:',
      registerData
    );


    return this.http.post<any>(
      `${this.apiUrl}/register`,
      registerData
    ).pipe(

      tap((response: any) => {

        console.log(
          'REGISTRATION RESPONSE:',
          response
        );


        this.saveAuthentication(
          response,
          email,
          username
        );

      })

    );

  }


  // =====================================================
  // SAVE LOGIN / REGISTER DATA
  // =====================================================

  private saveAuthentication(
    response: any,
    fallbackEmail: string,
    fallbackUsername: string = ''
  ): void {


    // ===================================================
    // GET DATA
    // ===================================================

    const data =
      response?.data || response;


    // ===================================================
    // GET USER
    // ===================================================

    const user =
      data?.user || data;


    // ===================================================
    // GET ACCESS TOKEN
    // ===================================================

    const accessToken =
      data?.accessToken ||
      response?.accessToken ||
      '';


    // ===================================================
    // GET REFRESH TOKEN
    // ===================================================

    const refreshToken =
      data?.refreshToken ||
      response?.refreshToken ||
      '';


    // ===================================================
    // GET USERNAME
    // ===================================================

    const username =
      user?.userName ||
      user?.username ||
      data?.userName ||
      data?.username ||
      fallbackUsername ||
      '';


    // ===================================================
    // GET EMAIL
    // ===================================================

    const email =
      user?.email ||
      data?.email ||
      fallbackEmail ||
      '';


    // ===================================================
    // SAVE ACCESS TOKEN
    // ===================================================

    if (accessToken) {

      localStorage.setItem(
        'accessToken',
        accessToken
      );

      console.log(
        'JWT access token saved.'
      );

    } else {

      console.error(
        'WARNING: Access token was not found.'
      );

    }


    // ===================================================
    // SAVE REFRESH TOKEN
    // ===================================================

    if (refreshToken) {

      localStorage.setItem(
        'refreshToken',
        refreshToken
      );

    }


    // ===================================================
    // SAVE USERNAME
    // ===================================================

    this.username =
      username;

    localStorage.setItem(
      'username',
      username
    );


    // ===================================================
    // SAVE EMAIL
    // ===================================================

    this.userEmail =
      email;

    localStorage.setItem(
      'userEmail',
      email
    );


    // ===================================================
    // SAVE COMPLETE USER
    // ===================================================

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );


    // ===================================================
    // UPDATE USER STATE
    // ===================================================

    this.usernameSubject.next(
      username
    );


    console.log(
      'Authenticated user:',
      {
        username: username,
        email: email,
        hasToken: !!accessToken
      }
    );

  }


  // =====================================================
  // GET ACCESS TOKEN
  // =====================================================

  getToken(): string | null {

    return localStorage.getItem(
      'accessToken'
    );

  }


  // =====================================================
  // GET REFRESH TOKEN
  // =====================================================

  getRefreshToken(): string | null {

    return localStorage.getItem(
      'refreshToken'
    );

  }


  // =====================================================
  // GET SAVED USER
  // =====================================================

  getUser(): any {

    const user =
      localStorage.getItem('user');


    if (!user) {

      return null;

    }


    try {

      return JSON.parse(user);

    } catch {

      return null;

    }

  }


  // =====================================================
  // LOGIN CHECK
  // =====================================================

  isLoggedIn(): boolean {

    return !!localStorage.getItem(
      'accessToken'
    );

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.username = '';

    this.userEmail = '';


    localStorage.removeItem(
      'accessToken'
    );

    localStorage.removeItem(
      'refreshToken'
    );

    localStorage.removeItem(
      'username'
    );

    localStorage.removeItem(
      'user'
    );

    localStorage.removeItem(
      'userEmail'
    );


    this.usernameSubject.next('');


    console.log(
      'User logged out.'
    );

  }


  // =====================================================
  // AUTH REQUIRED
  // =====================================================

  openAuthRequired(): void {

    this.showAuthRequired =
      true;

  }


  closeAuthRequired(): void {

    this.showAuthRequired =
      false;

  }

}

