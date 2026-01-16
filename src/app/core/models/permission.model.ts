// Permission Entity
export interface Permission {
    id: number;
    name: string;
    description?: string;
    routePath?: string;
    method?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Permission DTOs
export interface CreatePermissionDto {
    name: string;
    description?: string;
    routePath?: string;
    method?: string;
    isActive?: boolean;
}

export interface UpdatePermissionDto {
    name?: string;
    description?: string;
    routePath?: string;
    method?: string;
    isActive?: boolean;
}

export interface PermissionQueryParams {
    name?: string;
    isActive?: boolean;
    skipCount?: number;
    maxResultCount?: number;
}
