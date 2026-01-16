import { environment } from '../../../environments/environment';

export const API_CONFIG = {
    baseUrl: environment.apiUrl,
    version: environment.apiVersion,
    endpoints: {
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout',
            refresh: '/auth/refresh',
            me: '/auth/me' // Get current user info
        },
        users: {
            base: '/users',
            byId: (id: number) => `/users/${id}`,
            uploadAvatar: (id: number) => `/users/${id}/upload-avatar`,
            changePassword: '/users/change-password',
            roles: '/users/roles',
            userRoles: (id: number) => `/users/${id}/roles`,
            assignRoles: (id: number) => `/users/${id}/roles`
        },
        roles: {
            base: '/roles',
            byId: (id: number) => `/roles/${id}`,
            permissions: (id: number) => `/roles/${id}/permissions`,
            assignPermissions: (id: number) => `/roles/${id}/permissions`
        },
        permissions: {
            base: '/permissions',
            byId: (id: number) => `/permissions/${id}`
        },
        performance: {
            // Bỏ qua Performance & Monitoring endpoints
            // metrics: '/performance/metrics',
            // memory: '/performance/memory',
            // database: '/performance/database',
            // health: '/performance/health'
        }
    }
} as const;
