import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../../core/config/api.config';
import { LoginDto, RegisterDto, LoginResponse, RefreshTokenDto, RefreshTokenResponse, User, ApiResponse } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private baseUrl = API_CONFIG.baseUrl;

    login(dto: LoginDto): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}${API_CONFIG.endpoints.auth.login}`, dto);
    }

    register(dto: RegisterDto): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}${API_CONFIG.endpoints.auth.register}`, dto);
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}${API_CONFIG.endpoints.auth.logout}`, {});
    }

    refreshToken(dto: RefreshTokenDto): Observable<RefreshTokenResponse> {
        return this.http.post<RefreshTokenResponse>(`${this.baseUrl}${API_CONFIG.endpoints.auth.refresh}`, dto);
    }

    // Get current user info - POST method with token in header
    getCurrentUser(): Observable<User> {
        return this.http.post<ApiResponse<User>>(`${this.baseUrl}${API_CONFIG.endpoints.auth.me}`, {}).pipe(map((response) => response.results));
    }
}
