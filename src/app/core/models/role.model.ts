import { Permission } from './permission.model';

// Role Entity
export interface Role {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
    priority?: number;
    createdAt?: Date;
    updatedAt?: Date;
    permissions?: Permission[];
}

// Role DTOs
export interface CreateRoleDto {
    name: string;
    description?: string;
    isActive?: boolean;
    priority?: number;
    permissionIds?: number[];
}

export interface UpdateRoleDto {
    name?: string;
    description?: string;
    isActive?: boolean;
    priority?: number;
    permissionIds?: number[];
}

export interface AssignPermissionsDto {
    permissionIds: number[];
}

export interface RoleQueryParams {
    name?: string;
    isActive?: boolean;
    skipCount?: number;
    maxResultCount?: number;
}
