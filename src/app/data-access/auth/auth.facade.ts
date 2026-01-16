import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';
import { TokenService } from '../../core/services/token.service';
import { LoginDto, RegisterDto, LoginResponse } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {
    private authService = inject(AuthService);
    private authStore = inject(AuthStore);
    private tokenService = inject(TokenService);
    private router = inject(Router);

    // Promise để guard đợi auth check hoàn thành
    private authCheckPromise: Promise<void> | null = null;

    // Expose selectors
    currentUser = this.authStore.currentUser;
    isAuthenticated = this.authStore.isAuthenticated;
    loading = this.authStore.loading;
    error = this.authStore.error;

    // Đợi auth check hoàn thành
    waitForAuthCheck(): Promise<void> {
        return this.authCheckPromise || Promise.resolve();
    }

    // Actions
    login(dto: LoginDto): Observable<LoginResponse> {
        this.authStore.setLoading(true);
        return this.authService.login(dto).pipe(
            tap((response) => {
                this.handleAuthSuccess(response);
            }),
            catchError((error) => {
                this.authStore.setError(error.message || 'Login failed');
                throw error;
            })
        );
    }

    register(dto: RegisterDto): Observable<LoginResponse> {
        this.authStore.setLoading(true);
        return this.authService.register(dto).pipe(
            tap((response) => {
                this.authStore.setLoading(false);
            }),
            catchError((error) => {
                this.authStore.setError(error.message || 'Registration failed');
                throw error;
            })
        );
    }

    logout(): void {
        this.authStore.setLoading(true);
        this.authService.logout().subscribe({
            next: () => {
                this.handleLogout();
            },
            error: () => {
                // Even if API call fails, clear local state
                this.handleLogout();
            }
        });
    }

    refreshToken(): Observable<boolean> {
        const refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken) {
            return of(false);
        }

        return this.authService.refreshToken({ refreshToken }).pipe(
            tap((response) => {
                const { accessToken, refreshToken: newRefreshToken } = response.results;
                this.tokenService.saveTokens(accessToken, newRefreshToken);
                this.authStore.updateTokens(accessToken, newRefreshToken);
            }),
            catchError(() => {
                this.handleLogout();
                return of(false);
            }),
            map(() => true)
        );
    }

    async checkAuthStatus(): Promise<void> {
        this.authCheckPromise = this._checkAuthStatus();
        return this.authCheckPromise;
    }

    private async _checkAuthStatus(): Promise<void> {
        const token = this.tokenService.getAccessToken();

        if (!token) {
            return;
        }

        try {
            const user = await firstValueFrom(this.authService.getCurrentUser());
            this.authStore.setAuth(user, token, this.tokenService.getRefreshToken() || '');
        } catch {
            this.tokenService.clearTokens();
            this.authStore.clearAuth();
        }
    }

    private handleAuthSuccess(response: LoginResponse): void {
        const { accessToken, refreshToken, user } = response.results;
        this.tokenService.saveTokens(accessToken, refreshToken);
        this.authStore.setAuth(user, accessToken, refreshToken);
    }

    private handleLogout(): void {
        this.tokenService.clearTokens();
        this.authStore.clearAuth();
        this.router.navigate(['/auth/login']);
    }
}
