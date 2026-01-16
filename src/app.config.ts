import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { AuthFacade } from './app/data-access/auth/auth.facade';
import DiamondPreset from '../theme/diamond-preset';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: DiamondPreset,
                options: {
                    darkModeSelector: '.app-dark',
                    cssLayer: false // Disable CSS layers to avoid conflicts
                }
            }
        }),
        {
            provide: APP_INITIALIZER,
            useFactory: (authFacade: AuthFacade) => () => authFacade.checkAuthStatus(),
            deps: [AuthFacade],
            multi: true
        }
    ]
};
