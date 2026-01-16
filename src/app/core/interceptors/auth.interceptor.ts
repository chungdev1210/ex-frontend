import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const token = tokenService.getAccessToken();

    // Skip interceptor for auth endpoints
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
        return next(req);
    }

    // Clone request and add authorization header
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                'X-API-Version': environment.apiVersion
            }
        });
    }

    return next(req);
};
