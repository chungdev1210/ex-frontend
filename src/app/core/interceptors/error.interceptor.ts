import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const tokenService = inject(TokenService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 401:
                        // Unauthorized - clear tokens and redirect to login
                        tokenService.clearTokens();
                        router.navigate(['/auth/login']);
                        errorMessage = 'Unauthorized. Please login again.';
                        break;
                    case 403:
                        // Forbidden
                        router.navigate(['/auth/access']);
                        errorMessage = 'Access denied.';
                        break;
                    case 404:
                        errorMessage = 'Resource not found.';
                        break;
                    case 429:
                        errorMessage = 'Too many requests. Please try again later.';
                        break;
                    case 500:
                        errorMessage = 'Internal server error.';
                        break;
                    default:
                        errorMessage = error.error?.message || `Error Code: ${error.status}`;
                }
            }

            console.error('HTTP Error:', errorMessage, error);
            return throwError(() => ({ message: errorMessage, statusCode: error.status, error: error.error }));
        })
    );
};
