
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

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

  imports: [
    ReactiveFormsModule,
    CommonModule
  ],

  templateUrl: './navbar.html',

  styleUrls: ['./navbar.css']

})
export class Navbar
  implements OnInit, OnDestroy {


  // =====================================================
  // FORMS
  // =====================================================

  loginForm!: FormGroup;

  registerForm!: FormGroup;


  // =====================================================
  // USER
  // =====================================================

  username = '';

  isLoggedIn = false;


  // =====================================================
  // CREDITS
  // =====================================================

  availableCredits = 0;

  totalCredits = 100;

  creditPercentage = 0;

  /*
   * This is only used internally.
   *
   * DO NOT use it in HTML to show "..."
   */

  isLoadingCredits = false;

  creditError = '';


  // =====================================================
  // AUTH POPUPS
  // =====================================================

  showLogin = false;

  showRegister = false;


  // =====================================================
  // USER MENU
  // =====================================================

  showUserMenu = false;


  // =====================================================
  // ERRORS
  // =====================================================

  loginError = '';

  registerError = '';


  // =====================================================
  // SUBSCRIPTION
  // =====================================================

  private usernameSubscription?: Subscription;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private fb: FormBuilder,

    private authService: AuthService,

    private creditService: CreditService,

    private router: Router

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {


    // ===================================================
    // LOGIN FORM
    // ===================================================

    this.loginForm =
      this.fb.group({

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


    // ===================================================
    // REGISTER FORM
    // ===================================================

    this.registerForm =
      this.fb.group({

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


    // ===================================================
    // RESTORE USER
    // ===================================================

    this.username =
      this.authService.username;


    this.isLoggedIn =
      this.authService.isLoggedIn();


    console.log(
      'NAVBAR USER:',
      this.username
    );


    console.log(
      'NAVBAR LOGGED IN:',
      this.isLoggedIn
    );


    // ===================================================
    // RESTORE SAVED CREDITS FIRST
    // ===================================================

    if (this.isLoggedIn) {

      this.loadSavedCredits();

      /*
       * After displaying the saved value,
       * get the latest value from the API.
       */

      this.loadCredits();

    }


    // ===================================================
    // LISTEN FOR LOGIN / LOGOUT
    // ===================================================

    this.usernameSubscription =
      this.authService.username$
        .subscribe(

          (username: string) => {

            this.username =
              username;


            this.isLoggedIn =
              this.authService.isLoggedIn();


            console.log(
              'NAVBAR USER CHANGED:',
              this.username
            );


            // =========================================
            // USER LOGGED IN
            // =========================================

            if (this.isLoggedIn) {

              /*
               * First show saved credits.
               */

              this.loadSavedCredits();


              /*
               * Then update them from API.
               */

              this.loadCredits();

            }


            // =========================================
            // USER LOGGED OUT
            // =========================================

            else {

              this.availableCredits = 0;

              this.creditPercentage = 0;

              this.isLoadingCredits = false;

              this.creditError = '';

            }

          }

        );

  }


  // =====================================================
  // LOAD SAVED CREDITS
  // =====================================================

  loadSavedCredits(): void {

    const savedCredits =
      localStorage.getItem(
        'availableCredits'
      );


    console.log(
      'SAVED CREDITS:',
      savedCredits
    );


    if (
      savedCredits !== null
    ) {

      const credits =
        Number(savedCredits);


      if (
        !Number.isNaN(credits)
      ) {

        this.availableCredits =
          credits;


        this.updateCreditPercentage();


        console.log(
          'RESTORED CREDITS:',
          this.availableCredits
        );

      }

    }

  }


  // =====================================================
  // LOAD CREDITS FROM API
  // =====================================================

  loadCredits(): void {


    // ===================================================
    // CHECK JWT
    // ===================================================

    const token =
      this.authService.getToken();


    if (!token) {

      console.log(
        'No JWT token available.'
      );


      /*
       * IMPORTANT:
       *
       * Do NOT erase saved credits here.
       */

      return;

    }


    // ===================================================
    // START REQUEST
    // ===================================================

    this.isLoadingCredits =
      true;

    this.creditError =
      '';


    console.log(
      'REQUESTING CREDITS API...'
    );


    // ===================================================
    // API REQUEST
    // ===================================================

    this.creditService
      .getCredits()
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response: any) => {

          console.log(
            '===================================='
          );

          console.log(
            'CREDITS API RESPONSE:'
          );

          console.log(
            response
          );

          console.log(
            '===================================='
          );


          // =============================================
          // GET CREDITS
          // =============================================

          const credits =
            Number(
              response
                ?.data
                ?.availableCredits ?? 0
            );


          console.log(
            'API AVAILABLE CREDITS:',
            credits
          );


          // =============================================
          // SAVE IN COMPONENT
          // =============================================

          this.availableCredits =
            credits;


          // =============================================
          // SAVE IN LOCAL STORAGE
          // =============================================

          localStorage.setItem(
            'availableCredits',
            String(
              this.availableCredits
            )
          );


          // =============================================
          // UPDATE PROGRESS
          // =============================================

          this.updateCreditPercentage();


          // =============================================
          // FINISHED
          // =============================================

          this.isLoadingCredits =
            false;


          console.log(
            'FINAL NAVBAR CREDITS:',
            this.availableCredits
          );


          console.log(
            'FINAL CREDIT PERCENTAGE:',
            this.creditPercentage
          );

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error: any) => {

          console.error(
            'CREDITS API ERROR:',
            error
          );


          /*
           * IMPORTANT:
           *
           * DO NOT set availableCredits = 0.
           *
           * If we already have saved credits,
           * keep showing them.
           */

          this.creditError =
            error
              ?.error
              ?.message ||
            'Unable to load credits.';


          this.isLoadingCredits =
            false;


          /*
           * Keep the existing value.
           */

          this.updateCreditPercentage();

        }

      });

  }


  // =====================================================
  // UPDATE CREDIT PERCENTAGE
  // =====================================================

  updateCreditPercentage(): void {


    if (
      this.totalCredits <= 0
    ) {

      this.creditPercentage =
        0;

      return;

    }


    this.creditPercentage =
      (
        this.availableCredits /
        this.totalCredits
      ) * 100;


    // ================================================
    // KEEP BETWEEN 0 AND 100
    // ================================================

    this.creditPercentage =
      Math.max(

        0,

        Math.min(

          100,

          this.creditPercentage

        )

      );

  }


  // =====================================================
  // LOGIN
  // =====================================================

  onLogin(): void {


    this.loginError =
      '';


    if (
      this.loginForm.invalid
    ) {

      this.loginForm.markAllAsTouched();

      return;

    }


    const email =
      this.loginForm.value.email;


    const password =
      this.loginForm.value.password;


    this.authService
      .login(
        email,
        password
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'LOGIN SUCCESS:',
            response
          );


          /*
           * AuthService has already saved:
           *
           * accessToken
           * refreshToken
           * username
           * email
           * user
           *
           * and emitted username$
           */


          this.showLogin =
            false;


          this.loginForm.reset();


          /*
           * Get latest credits after login.
           *
           * username$ will also trigger this,
           * but this guarantees it happens here.
           */

          this.loadCredits();


          this.router.navigate([
            '/dashboard'
          ]);

        },


        error: (error: any) => {

          console.error(
            'LOGIN ERROR:',
            error
          );


          this.loginError =
            error
              ?.error
              ?.message ||
            'Login failed. Please check your email and password.';

        }

      });

  }


  // =====================================================
  // REGISTER
  // =====================================================

  onRegister(): void {


    this.registerError =
      '';


    if (
      this.registerForm.invalid
    ) {

      this.registerForm.markAllAsTouched();

      return;

    }


    const username =
      this.registerForm.value.username;


    const email =
      this.registerForm.value.email;


    const password =
      this.registerForm.value.password;


    this.authService
      .register(
        username,
        email,
        password
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'REGISTER SUCCESS:',
            response
          );


          this.showRegister =
            false;


          this.registerForm.reset();


          /*
           * AuthService already saves
           * the JWT and user information.
           */


          this.loadSavedCredits();


          this.loadCredits();


          this.router.navigate([
            '/'
          ]);

        },


        error: (error: any) => {

          console.error(
            'REGISTER ERROR:',
            error
          );


          this.registerError =
            error
              ?.error
              ?.message ||
            'Registration failed. Please try again.';

        }

      });

  }


  // =====================================================
  // OPEN LOGIN
  // =====================================================

  openLogin(): void {

    this.showLogin =
      true;

    this.showRegister =
      false;

    this.loginError =
      '';

  }


  // =====================================================
  // OPEN REGISTER
  // =====================================================

  openRegister(): void {

    this.showRegister =
      true;

    this.showLogin =
      false;

    this.registerError =
      '';

  }


  // =====================================================
  // CLOSE AUTH
  // =====================================================

  closeAuth(): void {

    this.showLogin =
      false;

    this.showRegister =
      false;

    this.loginForm.reset();

    this.registerForm.reset();

    this.loginError =
      '';

    this.registerError =
      '';

  }


  // =====================================================
  // SWITCH TO REGISTER
  // =====================================================

  switchToRegister(): void {

    this.showLogin =
      false;

    this.showRegister =
      true;

    this.loginError =
      '';

  }


  // =====================================================
  // SWITCH TO LOGIN
  // =====================================================

  switchToLogin(): void {

    this.showRegister =
      false;

    this.showLogin =
      true;

    this.registerError =
      '';

  }


  // =====================================================
  // USER MENU
  // =====================================================

  toggleUserMenu(): void {

    this.showUserMenu =
      !this.showUserMenu;

  }


  // =====================================================
  // PROFILE
  // =====================================================

  openProfile(): void {

    this.showUserMenu =
      false;


    this.router.navigate([
      '/user-dashboard'
    ]);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.authService.logout();


    this.username =
      '';

    this.isLoggedIn =
      false;


    this.availableCredits =
      0;

    this.creditPercentage =
      0;


    this.isLoadingCredits =
      false;


    this.creditError =
      '';


    /*
     * Remove saved credits too.
     */

    localStorage.removeItem(
      'availableCredits'
    );


    this.showUserMenu =
      false;


    this.router.navigate([
      '/'
    ]);

  }


  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {

    this.usernameSubscription
      ?.unsubscribe();

  }

}