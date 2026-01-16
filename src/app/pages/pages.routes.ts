import { Routes } from '@angular/router';

export default [
    { path: 'profile', loadChildren: () => import('./profile/profile.routes') },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
