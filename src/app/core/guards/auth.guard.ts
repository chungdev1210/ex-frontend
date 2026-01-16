import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthFacade } from '../../data-access/auth/auth.facade';

export const authGuard: CanActivateFn = async (route, state) => {
    const authFacade = inject(AuthFacade);
    const router = inject(Router);

    // Đợi auth check hoàn thành trước
    await authFacade.waitForAuthCheck();

    if (authFacade.isAuthenticated()) {
        return true;
    }

    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};
