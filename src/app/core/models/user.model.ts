import { ApiResponse } from './common.model';
import { Role } from './role.model';

// User Entity
export interface User {
    id: number;
    userName: string;
    email: string;
    fullName?: string | null;
    isActive?: boolean;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    roles?: Role[];
    permissions?: string[];
    tokenVersion?: number;
}

// User DTOs
export interface CreateUserDto {
    userName: string;
    email: string;
    password: string;
    fullName?: string;
}

export interface UpdateUserDto {
    userName?: string;
    email?: string;
    fullName?: string;
    isActive?: boolean;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    // confirmPassword: string;
}

export interface ChangePasswordResult {
    accessToken: string;
    refreshToken: string;
}

export type ChangePasswordResponse = ApiResponse<ChangePasswordResult>;

export interface UserQueryParams {
    userName?: string;
    email?: string;
    isActive?: boolean;
    skipCount?: number;
    maxResultCount?: number;
}

export interface AssignRolesDto {
    roleIds: number[];
}
