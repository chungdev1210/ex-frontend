import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthFacade } from '../../data-access/auth/auth.facade';

export const guestGuard: CanActivateFn = async () => {
    const authFacade = inject(AuthFacade);
    const router = inject(Router);

    // Đợi auth check hoàn thành
    await authFacade.waitForAuthCheck();

    // Nếu đã đăng nhập → redirect về trang chủ
    if (authFacade.isAuthenticated()) {
        router.navigate(['/']);
        return false;
    }

    return true;
};
