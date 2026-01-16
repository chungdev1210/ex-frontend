import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = environment.tokenKey;
    private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;
    private readonly TOKEN_EXPIRY_KEY = environment.tokenExpiryKey;

    // Access Token
    getAccessToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setAccessToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeAccessToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    // Refresh Token
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    setRefreshToken(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    removeRefreshToken(): void {
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    // Token Expiry
    getTokenExpiry(): number | null {
        const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
        return expiry ? parseInt(expiry, 10) : null;
    }

    setTokenExpiry(expiresIn: number): void {
        const expiryTime = Date.now() + expiresIn * 1000;
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    removeTokenExpiry(): void {
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }

    // Token Validation
    isTokenExpired(): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return true;
        return Date.now() >= expiry;
    }

    // Clear All Tokens
    clearTokens(): void {
        this.removeAccessToken();
        this.removeRefreshToken();
        this.removeTokenExpiry();
    }

    // Save Tokens
    saveTokens(accessToken: string, refreshToken: string): void {
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
    }
}
