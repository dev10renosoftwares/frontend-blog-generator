
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { ProfileService } from '../../services/profile';


interface UserProfile {

  userId: number;

  userName: string;

  email: string;

  profilePictureUrl: string | null;

  availableCredits: number;

  role: string;

}


interface ProfileResponse {

  success: boolean;

  message: string;

  data: UserProfile;

}


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
export class UserDashboardComponent
  implements OnInit {


  // =====================================================
  // USER PROFILE
  // =====================================================

  profile: UserProfile | null = null;


  // =====================================================
  // USERNAME
  // =====================================================

  username = 'User';


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;


  // =====================================================
  // ERROR
  // =====================================================

  profileError = false;


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


    // ---------------------------------------------------
    // GET SAVED USER FIRST
    // ---------------------------------------------------

    const savedUser =
      localStorage.getItem('user');


    if (savedUser) {

      try {

        const user =
          JSON.parse(savedUser);


        console.log(
          'SAVED USER:',
          user
        );


        if (user.userName) {

          this.username =
            user.userName;

        }


        if (user.userId) {

          this.profile = {

            userId:
              user.userId,

            userName:
              user.userName ||
              this.username,

            email:
              user.email || '',

            profilePictureUrl:
              user.profilePictureUrl ||
              null,

            availableCredits:
              Number(
                user.availableCredits || 0
              ),

            role:
              user.role ||
              'User'

          };

        }

      }

      catch (error) {

        console.error(
          'Saved user parsing error:',
          error
        );

      }

    }


    // ---------------------------------------------------
    // CALL API
    // ---------------------------------------------------

    this.profileService
      .getProfile()
      .subscribe({

        next: (response: ProfileResponse) => {

          console.log(
            'PROFILE API RESPONSE:',
            response
          );


          if (
            response &&
            response.data
          ) {

            // -------------------------------------------
            // SET PROFILE
            // -------------------------------------------

            this.profile =
              response.data;


            // -------------------------------------------
            // SET USERNAME
            // -------------------------------------------

            this.username =
              response.data.userName;


            // -------------------------------------------
            // SAVE USER
            // -------------------------------------------

            localStorage.setItem(
              'username',
              this.username
            );


            localStorage.setItem(
              'userEmail',
              response.data.email
            );


            localStorage.setItem(
              'user',
              JSON.stringify(
                response.data
              )
            );


            console.log(
              'USER DISPLAY NAME:',
              this.username
            );


            console.log(
              'PROFILE OBJECT:',
              this.profile
            );


            this.profileError =
              false;

          }


          // IMPORTANT
          // Do NOT keep the page in loading state.

          this.loading =
            false;

        },


        error: (error: any) => {

          console.error(
            'PROFILE ERROR:',
            error
          );


          // If we already have saved profile,
          // don't destroy it.

          if (!this.profile) {

            this.profileError =
              true;

          }


          this.loading =
            false;

        }

      });

  }


  // =====================================================
  // INITIAL
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
