import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { AuthService } from '../core/services/auth';


export const authInterceptor: HttpInterceptorFn =
  (req, next) => {

    const authService = inject(AuthService);


    // =====================================================
    // PUBLIC AUTH REQUESTS
    // =====================================================

    const isPublicRequest =
      req.url.includes('/Auth/login') ||
      req.url.includes('/Auth/register') ||
      req.url.includes('/Auth/refresh-token');


    // =====================================================
    // PUBLIC REQUEST
    // =====================================================

    if (isPublicRequest) {

      console.log(
        'PUBLIC API REQUEST:',
        req.url
      );

      return next(req);
    }


    // =====================================================
    // GET ACCESS TOKEN
    // =====================================================

    const accessToken =
      authService.getToken();


    // =====================================================
    // NO ACCESS TOKEN
    // =====================================================

    if (!accessToken) {

      console.log(
        'NO ACCESS TOKEN:',
        req.url
      );

      return next(req);
    }


    // =====================================================
    // ADD ACCESS TOKEN
    // =====================================================

    const authReq =
      req.clone({
        setHeaders: {
          Authorization:
            `Bearer ${accessToken}`
        }
      });


    console.log(
      'AUTHENTICATED API REQUEST:',
      req.url
    );


    // =====================================================
    // SEND REQUEST
    // =====================================================

    return next(authReq).pipe(

      catchError(
        (error: HttpErrorResponse) => {

          // =============================================
          // ONLY HANDLE 401
          // =============================================

          if (error.status !== 401) {

            return throwError(
              () => error
            );
          }


          // =============================================
          // 401 RECEIVED
          // =============================================

          console.log(
            '401 Unauthorized:',
            req.url
          );

          console.log(
            'Trying refresh token...'
          );


          // =============================================
          // REFRESH TOKEN
          // =============================================

          return authService
            .refreshToken()
            .pipe(

              switchMap(
                () => {

                  // ===================================
                  // GET NEW ACCESS TOKEN
                  // ===================================

                  const newAccessToken =
                    authService.getToken();


                  if (!newAccessToken) {

                    console.error(
                      'No new access token after refresh.'
                    );

                    authService.logout();

                    return throwError(
                      () =>
                        new Error(
                          'Session expired. Please login again.'
                        )
                    );
                  }


                  // ===================================
                  // RETRY ORIGINAL REQUEST
                  // ===================================

                  const retryRequest =
                    req.clone({
                      setHeaders: {
                        Authorization:
                          `Bearer ${newAccessToken}`
                      }
                    });


                  console.log(
                    'RETRYING REQUEST:',
                    req.url
                  );


                  return next(
                    retryRequest
                  );

                }
              ),


              // =========================================
              // REFRESH FAILED
              // =========================================

              catchError(
                (refreshError) => {

                  console.error(
                    'Refresh token failed:',
                    refreshError
                  );

                  authService.logout();

                  return throwError(
                    () => refreshError
                  );
                }
              )

            );

        }
      )

    );

  };