// Common API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    results: T;
    message?: string;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    skipCount?: number;
    maxResultCount?: number;
}

export interface QueryParams {
    skipCount?: number;
    maxResultCount?: number;
    sorting?: string;
}

// Loading State
export interface LoadingState {
    loading: boolean;
    error: string | null;
}

// API Error
export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}
