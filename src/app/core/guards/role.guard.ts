import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthFacade } from '../../data-access/auth/auth.facade';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return (route, state) => {
        const authFacade = inject(AuthFacade);
        const router = inject(Router);

        const user = authFacade.currentUser();

        if (!user) {
            router.navigate(['/auth/login']);
            return false;
        }

        const userRoles = user.roles?.map((r) => r.name) || [];
        const hasRole = allowedRoles.some((role) => userRoles.includes(role));

        if (!hasRole) {
            router.navigate(['/auth/access']);
            return false;
        }

        return true;
    };
};
