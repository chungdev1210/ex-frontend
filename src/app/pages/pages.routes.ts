import { Routes } from '@angular/router';

export default [
    { path: 'profile', loadChildren: () => import('./profile/profile.routes') },
    { path: 'permissions', loadChildren: () => import('./permissions/permissions.routes') },
    { path: 'roles', loadChildren: () => import('./roles/roles.routes') },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
