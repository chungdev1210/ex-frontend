import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { PermissionsService } from './permissions.service';
import { PermissionsStore } from './permissions.store';
import { Permission, CreatePermissionDto, UpdatePermissionDto } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class PermissionsFacade {
    private permissionsService = inject(PermissionsService);
    private permissionsStore = inject(PermissionsStore);

    // Expose selectors
    permissions$ = this.permissionsStore.permissions;
    selectedPermission$ = this.permissionsStore.selectedPermission;
    loading$ = this.permissionsStore.loading;
    error$ = this.permissionsStore.error;

    // Actions
    loadPermissions(): void {
        this.permissionsStore.setLoading(true);
        this.permissionsService.getAll().subscribe({
            next: (response) => {
                this.permissionsStore.setPermissions(response.results);
            },
            error: (error) => {
                this.permissionsStore.setError(error.message || 'Failed to load permissions');
            }
        });
    }

    loadPermissionById(id: number): void {
        this.permissionsStore.setLoading(true);
        this.permissionsService.getById(id).subscribe({
            next: (response) => {
                this.permissionsStore.setSelectedPermission(response.results);
                this.permissionsStore.setLoading(false);
            },
            error: (error) => {
                this.permissionsStore.setError(error.message || 'Failed to load permission');
            }
        });
    }

    createPermission(dto: CreatePermissionDto): Observable<void> {
        this.permissionsStore.setLoading(true);
        return this.permissionsService.create(dto).pipe(
            tap((response) => {
                this.permissionsStore.addPermission(response.results);
                this.permissionsStore.setLoading(false);
            }),
            catchError((error) => {
                this.permissionsStore.setError(error.message || 'Failed to create permission');
                return throwError(() => error);
            }),
            map(() => void 0)
        );
    }

    updatePermission(id: number, dto: UpdatePermissionDto): Observable<void> {
        this.permissionsStore.setLoading(true);
        return this.permissionsService.update(id, dto).pipe(
            tap((response) => {
                this.permissionsStore.updatePermission(response.results);
                this.permissionsStore.setLoading(false);
            }),
            catchError((error) => {
                this.permissionsStore.setError(error.message || 'Failed to update permission');
                return throwError(() => error);
            }),
            map(() => void 0)
        );
    }

    deletePermission(id: number): Observable<void> {
        this.permissionsStore.setLoading(true);
        return this.permissionsService.delete(id).pipe(
            tap(() => {
                this.permissionsStore.removePermission(id);
                this.permissionsStore.setLoading(false);
            }),
            catchError((error) => {
                this.permissionsStore.setError(error.message || 'Failed to delete permission');
                return throwError(() => error);
            }),
            map(() => void 0)
        );
    }

    selectPermission(permission: Permission | null): void {
        this.permissionsStore.setSelectedPermission(permission);
    }

    clearError(): void {
        this.permissionsStore.setError(null);
    }
}
