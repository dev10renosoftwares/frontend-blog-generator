import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  CreditPricingResponseDto
} from '../../../ServiceModels/v1/Credit/CreditPricingResponseDto';

import {
  GetCreditsResponseDto
} from '../../../ServiceModels/v1/Credit/GetCreditsResponseDto';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  AuthService
} from '../../../core/services/auth';

import {
  CreditService
} from '../../../services/credit';


// =====================================================
// PASSWORD VALIDATOR
// =====================================================

function passwordsMatchValidator(
  group: AbstractControl
): ValidationErrors | null {

  const password =
    group.get('password')?.value;

  const confirmPassword =
    group.get('confirmPassword')?.value;

  return password === confirmPassword
    ? null
    : {
        passwordMismatch: true
      };

}


// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector: 'app-navbar',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './navbar.html',

  styleUrls: ['./navbar.css']

})
export class Navbar
  implements OnInit, OnDestroy {


  // =====================================================
  // AUTH POPUPS
  // =====================================================

  showLogin = false;

  showRegister = false;

  loginForm!: FormGroup;

  registerForm!: FormGroup;

  loginError = '';

  registerError = '';

  isLoggingIn = false;

  isRegistering = false;


  // =====================================================
  // USER
  // =====================================================

  isLoggedIn = false;

  username = '';

  showUserMenu = false;


  // =====================================================
  // CREDITS
  // =====================================================

  availableCredits = 0;

  creditPercentage = 0;


  // =====================================================
  // CREDIT PRICING
  // =====================================================

  showCreditPricing = false;

  isLoadingCreditPricing = false;

  creditPricingError = '';

  creditPricing:
    CreditPricingResponseDto[] = [];


  // =====================================================
  // SUBSCRIPTION
  // =====================================================

  private usernameSubscription?:
    Subscription;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private fb: FormBuilder,

    private router: Router,

    private authService: AuthService,

    private creditService: CreditService

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
        ],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]

      }, {

        validators:
          passwordsMatchValidator

      });


    // ===================================================
    // RESTORE LOGIN
    // ===================================================

    this.username =
      this.authService.getUsername();


    this.isLoggedIn =
      this.authService.isLoggedIn();


    // ===================================================
    // LOAD CREDITS
    // ===================================================

    if (this.isLoggedIn) {

      this.getAvailableCredits();

    }


    // ===================================================
    // LISTEN FOR USERNAME CHANGES
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
              'NAVBAR USER:',
              this.username
            );


            if (this.isLoggedIn) {

              this.getAvailableCredits();

            }

          }
        );

  }


  // =====================================================
  // LOGIN STATUS
  // =====================================================

  checkLoginStatus(): void {

    this.isLoggedIn =
      this.authService.isLoggedIn();

  }


  // =====================================================
  // OPEN LOGIN
  // =====================================================

  openLogin(): void {

    this.showLogin = true;

    this.showRegister = false;

    this.loginError = '';

  }


  // =====================================================
  // OPEN REGISTER
  // =====================================================

  openRegister(): void {

    this.showRegister = true;

    this.showLogin = false;

    this.registerError = '';

  }


  // =====================================================
  // CLOSE AUTH
  // =====================================================

  closeAuth(): void {

    this.showLogin = false;

    this.showRegister = false;

    this.loginError = '';

    this.registerError = '';

  }


  // =====================================================
  // SWITCH REGISTER
  // =====================================================

  switchToRegister(): void {

    this.showLogin = false;

    this.showRegister = true;

    this.loginError = '';

  }


  // =====================================================
  // SWITCH LOGIN
  // =====================================================

  switchToLogin(): void {

    this.showRegister = false;

    this.showLogin = true;

    this.registerError = '';

  }


  // =====================================================
  // LOGIN
  // =====================================================

  onLogin(): void {


    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    this.loginError = '';

    this.isLoggingIn = true;


    const email =
      this.loginForm.get(
        'email'
      )?.value;


    const password =
      this.loginForm.get(
        'password'
      )?.value;


    this.authService
      .login(
        email,
        password
      )
      .subscribe({

        next: () => {

          this.isLoggingIn = false;

          this.isLoggedIn = true;

          this.showLogin = false;

          this.loginForm.reset();


          /*
           * AuthService has already stored
           * username and tokens.
           */

          this.username =
            this.authService.getUsername();


          this.getAvailableCredits();

        },


        error: (error) => {

          this.isLoggingIn = false;

          this.loginError =
            error?.error?.message ||
            'Invalid email or password.';

        }

      });

  }


  // =====================================================
  // REGISTER
  // =====================================================

  onRegister(): void {


    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }


    this.registerError = '';

    this.isRegistering = true;


    const username =
      this.registerForm.get(
        'username'
      )?.value;


    const email =
      this.registerForm.get(
        'email'
      )?.value;


    const password =
      this.registerForm.get(
        'password'
      )?.value;


    this.authService
      .register(
        username,
        email,
        password
      )
      .subscribe({

        next: () => {

          this.isRegistering = false;


          /*
           * IMPORTANT:
           *
           * Registration already returns
           * accessToken + refreshToken.
           *
           * Therefore the user is already
           * logged in.
           */

          this.isLoggedIn = true;


          this.username =
            this.authService.getUsername();


          this.showRegister = false;

          this.showLogin = false;

          this.showUserMenu = false;


          this.registerForm.reset();


          /*
           * Load the user's initial
           * 100 credits.
           */

          this.getAvailableCredits();


          console.log(
            'REGISTRATION LOGIN SUCCESS:',
            this.username
          );

        },


        error: (error) => {

          this.isRegistering = false;

          this.registerError =
            error?.error?.message ||
            'Registration failed. Please try again.';

        }

      });

  }


  // =====================================================
  // GET AVAILABLE CREDITS
  // =====================================================



getAvailableCredits(): void {

  if (!this.authService.getToken()) {

    this.availableCredits = 0;

    this.creditPercentage = 0;

    return;

  }


  this.creditService
    .getCredits()
    .subscribe({

      next: (response) => {

        console.log(
          'AVAILABLE CREDITS RESPONSE:',
          response
        );


        const credits =
          Number(
            (response as any)?.data?.availableCredits ??
            (response as any)?.availableCredits ??
            0
          );


        this.availableCredits =
          credits;


        this.creditPercentage =
          Math.min(
            Math.max(
              credits,
              0
            ),
            100
          );


        localStorage.setItem(
          'availableCredits',
          String(
            credits
          )
        );

      },


      error: (error) => {

        console.error(
          'AVAILABLE CREDITS ERROR:',
          error
        );

      }

    });

}





  // =====================================================
  // OPEN CREDIT PRICING
  // =====================================================

  openCreditPricing(): void {

    this.showCreditPricing = true;

    this.creditPricingError = '';

    this.creditPricing = [];

    this.getCreditPricing();

  }


  // =====================================================
  // CLOSE CREDIT PRICING
  // =====================================================

  closeCreditPricing(): void {

    this.showCreditPricing = false;

  }


  // =====================================================
  // GET CREDIT PRICING
  // =====================================================

  getCreditPricing(): void {


    this.isLoadingCreditPricing = true;

    this.creditPricingError = '';


    this.creditService
      .getCreditPricing()
      .subscribe({

        next: (
          response: any
        ) => {

          console.log(
            'CREDIT PRICING RESPONSE:',
            response
          );


          /*
           * Support:
           *
           * [
           *   {...}
           * ]
           *
           * OR:
           *
           * {
           *   data: [...]
           * }
           */

          let pricing: any[] = [];


          if (
            Array.isArray(response)
          ) {

            pricing =
              response;

          }
          else if (
            Array.isArray(
              response?.data
            )
          ) {

            pricing =
              response.data;

          }


          this.creditPricing =
            pricing;


          if (
            pricing.length === 0
          ) {

            this.creditPricingError =
              'Credit pricing is currently unavailable.';

          }
          else {

            this.creditPricingError =
              '';

          }


          this.isLoadingCreditPricing =
            false;

        },


        error: (error) => {

          console.error(
            'CREDIT PRICING ERROR:',
            error
          );


          this.creditPricing = [];

          this.isLoadingCreditPricing =
            false;


          if (
            error?.status === 401
          ) {

            this.creditPricingError =
              'You are not authorized to view credit pricing.';

          }
          else if (
            error?.status === 404
          ) {

            this.creditPricingError =
              'Credit pricing API was not found.';

          }
          else {

            this.creditPricingError =
              error?.error?.message ||
              'Unable to load credit pricing.';

          }

        }

      });

  }


  // =====================================================
  // USER MENU
  // =====================================================

  toggleUserMenu(): void {

    this.showUserMenu =
      !this.showUserMenu;

  }


  // =====================================================
  // OPEN PROFILE
  // =====================================================

  openProfile(): void {

    this.showUserMenu = false;

    this.router.navigate([
      '/user-dashboard'
    ]);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.authService.logout();


    this.isLoggedIn =
      false;


    this.username =
      '';


    this.availableCredits =
      0;


    this.creditPercentage =
      0;


    this.creditPricing =
      [];


    this.showCreditPricing =
      false;


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

    if (
      this.usernameSubscription
    ) {

      this.usernameSubscription.unsubscribe();

    }

  }

}