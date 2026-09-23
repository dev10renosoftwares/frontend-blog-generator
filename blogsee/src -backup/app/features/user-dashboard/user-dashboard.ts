import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { UserProfileDto } from '../../ServiceModels/v1/Profile/UserProfileDto';
import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-user-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit {

  // =====================================================
  // USER PROFILE
  // =====================================================

  profile: UserProfileDto | null = null;


  // =====================================================
  // USERNAME
  // =====================================================

  username = 'User';


  // =====================================================
  // EMAIL
  // =====================================================

  email = '';


  // =====================================================
  // AVAILABLE CREDITS
  // =====================================================

  availableCredits = 0;


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;


  // =====================================================
  // ERROR
  // =====================================================

  profileError = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    console.log(
      'USER DASHBOARD CREATED'
    );

    this.loadProfile();

  }


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  loadProfile(): void {

    console.log(
      'LOADING PROFILE...'
    );

    this.loading = true;
    this.profileError = false;


    // ===================================================
    // FIRST: LOAD SAVED VALUES
    // ===================================================

    const savedUsername =
      localStorage.getItem('username');

    const savedEmail =
      localStorage.getItem('userEmail');

    const savedCredits =
      localStorage.getItem('availableCredits');


    if (savedUsername) {

      this.username =
        savedUsername;

    }


    if (savedEmail) {

      this.email =
        savedEmail;

    }


    if (savedCredits) {

      this.availableCredits =
        Number(savedCredits);

    }


    // ===================================================
    // THEN: CALL PROFILE API
    // ===================================================

    this.profileService
      .getProfile()
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response: UserProfileDto) => {

          console.log(
            'PROFILE API RESPONSE:',
            response
          );


          if (!response) {

            console.error(
              'PROFILE RESPONSE IS EMPTY'
            );

            this.profileError = true;
            this.loading = false;

            return;

          }


          // =============================================
          // SAVE COMPLETE PROFILE
          // =============================================

          this.profile =
            response;


          // =============================================
          // USERNAME
          // =============================================

          if (response.userName) {

            this.username =
              response.userName;

            localStorage.setItem(
              'username',
              response.userName
            );

          }


          // =============================================
          // EMAIL
          // =============================================

          if (response.email) {

            this.email =
              response.email;

            localStorage.setItem(
              'userEmail',
              response.email
            );

          }


          // =============================================
          // AVAILABLE CREDITS
          // =============================================

          if (
            response.availableCredits !== undefined &&
            response.availableCredits !== null
          ) {

            this.availableCredits =
              response.availableCredits;

            localStorage.setItem(
              'availableCredits',
              String(response.availableCredits)
            );

          }


          // =============================================
          // SAVE COMPLETE PROFILE
          // =============================================

          localStorage.setItem(
            'user',
            JSON.stringify(response)
          );


          // =============================================
          // LOG VALUES
          // =============================================

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
            this.availableCredits
          );

          console.log(
            'PROFILE:',
            this.profile
          );


          this.profileError = false;

          this.loading = false;

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error: any) => {

          console.error(
            'PROFILE ERROR:',
            error
          );


          /*
           * The API failed.
           *
           * We do NOT immediately erase the
           * username or credits because we may
           * already have valid saved values.
           */


          const savedUsername =
            localStorage.getItem('username');

          const savedEmail =
            localStorage.getItem('userEmail');

          const savedCredits =
            localStorage.getItem('availableCredits');


          if (savedUsername) {

            this.username =
              savedUsername;

          }


          if (savedEmail) {

            this.email =
              savedEmail;

          }


          if (savedCredits) {

            this.availableCredits =
              Number(savedCredits);

          }


          /*
           * Only show profile error if we
           * really have no saved information.
           */

          if (
            !savedUsername &&
            !savedEmail
          ) {

            this.profileError = true;

          }


          this.loading = false;

        }

      });

  }


  // =====================================================
  // USER INITIAL
  // =====================================================

  getUserInitial(): string {

    const name =
      this.profile?.userName ||
      this.username ||
      'User';


    return name
      .trim()
      .charAt(0)
      .toUpperCase() || 'U';

  }


  // =====================================================
  // BACK
  // =====================================================

  goBack(): void {

    this.router.navigate([
      '/'
    ]);

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refreshProfile(): void {

    this.loadProfile();

  }

}