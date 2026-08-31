import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth';
import { CreditService } from '../../../services/credit';


@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {


  // =========================
  // FORMS
  // =========================

  loginForm!: FormGroup;
  registerForm!: FormGroup;


  // =========================
  // USER
  // =========================

  username = '';
  isLoggedIn = false;


  // =========================
  // CREDITS
  // =========================

  availableCredits = 0;
  isLoadingCredits = false;
  creditError = '';
  maxCredits: number | undefined;

getCreditPercentage(): number {

  const maxCredits = this.maxCredits;

  if (maxCredits === undefined || maxCredits <= 0) {
    return 0;
  }

  const percentage =
    (this.availableCredits / maxCredits) * 100;

  return Math.min(Math.max(percentage, 0), 100);
}
  // =========================
  // AUTH POPUPS
  // =========================

  showLogin = false;
  showRegister = false;


  // =========================
  // USER DROPDOWN
  // =========================

  showUserMenu = false;


  // =========================
  // ERROR MESSAGES
  // =========================

  loginError = '';
  registerError = '';


  // =========================
  // USERNAME SUBSCRIPTION
  // =========================

  private usernameSubscription!: Subscription;


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private creditService: CreditService,
    private router: Router
  ) {}


  // =========================
  // ON INIT
  // =========================

  ngOnInit(): void {


    // =========================
    // LOGIN FORM
    // =========================

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });


    // =========================
    // REGISTER FORM
    // =========================

    this.registerForm = this.fb.group({

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });


    // =========================
    // GET SAVED USER
    // =========================

    this.username =
      this.authService.username;

    this.isLoggedIn =
      this.authService.isLoggedIn();


    // =========================
    // LOAD CREDITS IF LOGGED IN
    // =========================

    if (this.isLoggedIn) {

      this.loadCredits();

    }


    // =========================
    // LISTEN FOR USERNAME CHANGES
    // =========================

    this.usernameSubscription =
      this.authService.username$.subscribe(
        (username: string) => {

          this.username = username;

          this.isLoggedIn =
            username.length > 0;


          console.log(
            'Navbar username:',
            this.username
          );


          // Load credits when user logs in
          if (this.isLoggedIn) {

            this.loadCredits();

          }

        }
      );

  }


  // =========================
  // LOAD CREDITS
  // =========================

  loadCredits(): void {

    this.creditError = '';

    const token =
      localStorage.getItem('accessToken');


    // No token
    if (!token) {

      console.log(
        'No access token found.'
      );

      this.availableCredits = 0;

      return;

    }


    this.isLoadingCredits = true;


    this.creditService
      .getCredits()
      .subscribe({

        next: (response) => {

          console.log(
            'Credits API response:',
            response
          );


          /*
           * Your API response:
           *
           * response.data.availableCredits
           */

          this.availableCredits =
            response.data.availableCredits;


          console.log(
            'Available credits:',
            this.availableCredits
          );


          this.isLoadingCredits = false;

        },


        error: (error) => {

          console.error(
            'Credits API error:',
            error
          );


          this.creditError =
            error?.error?.message ||
            'Unable to load credits.';


          this.isLoadingCredits = false;

        }

      });

  }


  // =========================
  // LOGIN
  // =========================

  onLogin(): void {

    this.loginError = '';


    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    const email =
      this.loginForm.value.email;

    const password =
      this.loginForm.value.password;


    this.authService
      .login(email, password)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Login successful:',
            response
          );


          this.showLogin = false;

          this.loginForm.reset();

          this.isLoggedIn = true;


          // Load credits after login
          this.loadCredits();


          this.router.navigate([
            '/'
          ]);

        },


        error: (error: {
          error: {
            message: string;
          };
        }) => {

          console.error(
            'Login error:',
            error
          );


          this.loginError =
            error?.error?.message ||
            'Login failed. Please check your email and password.';

        }

      });

  }


  // =========================
  // REGISTER
  // =========================

  onRegister(): void {

    this.registerError = '';


    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }


    const username =
      this.registerForm.value.username;

    const email =
      this.registerForm.value.email;

    const password =
      this.registerForm.value.password;


    console.log(
      'Registering user:',
      username
    );


    this.authService
      .register(
        username,
        email,
        password
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Registration successful:',
            response
          );


          this.showRegister = false;

          this.registerForm.reset();

          this.isLoggedIn = true;


          // Load credits after registration
          this.loadCredits();


          this.router.navigate([
            '/dashboard'
          ]);

        },


        error: (error: {
          error: {
            message: string;
          };
        }) => {

          console.error(
            'Registration error:',
            error
          );


          this.registerError =
            error?.error?.message ||
            'Registration failed. Please try again.';

        }

      });

  }


  // =========================
  // OPEN LOGIN
  // =========================

  openLogin(): void {

    this.showLogin = true;

    this.showRegister = false;

    this.loginError = '';

  }


  // =========================
  // OPEN REGISTER
  // =========================

  openRegister(): void {

    this.showRegister = true;

    this.showLogin = false;

    this.registerError = '';

  }


  // =========================
  // CLOSE AUTH POPUP
  // =========================

  closeAuth(): void {

    this.showLogin = false;

    this.showRegister = false;

    this.loginForm.reset();

    this.registerForm.reset();

    this.loginError = '';

    this.registerError = '';

  }


  // =========================
  // SWITCH TO REGISTER
  // =========================

  switchToRegister(): void {

    this.showLogin = false;

    this.showRegister = true;

  }


  // =========================
  // SWITCH TO LOGIN
  // =========================

  switchToLogin(): void {

    this.showRegister = false;

    this.showLogin = true;

  }


  // =========================
  // USER DROPDOWN
  // =========================

  toggleUserMenu(): void {

    this.showUserMenu =
      !this.showUserMenu;

  }


  // =========================
  // PROFILE
  // =========================

  openProfile(): void {

    this.showUserMenu = false;

    this.router.navigate([
      '/user-dashboard'
    ]);

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    this.authService.logout();

    this.username = '';

    this.isLoggedIn = false;

    // Reset credits on logout
    this.availableCredits = 0;

    this.showUserMenu = false;


    this.router.navigate([
      '/'
    ]);

  }


  // =========================
  // DESTROY
  // =========================

  ngOnDestroy(): void {

    if (this.usernameSubscription) {

      this.usernameSubscription.unsubscribe();

    }

  }

}