import { User } from './user.model';
import { ApiResponse } from './common.model';

// Auth DTOs
export interface LoginDto {
    userName: string;
    password: string;
}

export interface RegisterDto {
    userName: string;
    email: string;
    password: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export type LoginResponse = ApiResponse<LoginResult>;

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface RefreshTokenResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export type RefreshTokenResponse = ApiResponse<RefreshTokenResult>;

// Auth State
export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
