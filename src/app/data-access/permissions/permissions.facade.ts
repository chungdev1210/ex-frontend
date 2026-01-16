import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { PermissionsService } from './permissions.service';
import { PermissionsStore } from './permissions.store';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionQueryParams } from '../../core/models';

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
    totalCount$ = this.permissionsStore.totalCount;

    // Actions
    loadPermissions(params?: PermissionQueryParams): void {
        this.permissionsStore.setLoading(true);
        this.permissionsService.getAll(params).subscribe({
            next: (result) => {
                this.permissionsStore.setPermissions(result.items, result.totalCount);
            },
            error: (error) => {
                this.permissionsStore.setError(error.message || 'Failed to load permissions');
            }
        });
    }

    loadPermissionById(id: number): void {
        this.permissionsStore.setLoading(true);
        this.permissionsService.getById(id).subscribe({
            next: (permission) => {
                this.permissionsStore.setSelectedPermission(permission);
                this.permissionsStore.setLoading(false);
            },
            error: (error) => {
                this.permissionsStore.setError(error.message || 'Failed to load permission');
            }
        });
    }

    createPermission(dto: CreatePermissionDto): Observable<Permission> {
        this.permissionsStore.setLoading(true);
        return this.permissionsService.create(dto).pipe(
            tap((permission) => {
                this.permissionsStore.addPermission(permission);
                this.permissionsStore.setLoading(false);
            }),
            catchError((error) => {
                this.permissionsStore.setError(error.message || 'Failed to create permission');
                return throwError(() => error);
            })
        );
    }

    updatePermission(id: number, dto: UpdatePermissionDto): Observable<Permission> {
        this.permissionsStore.setLoading(true);
        return this.permissionsService.update(id, dto).pipe(
            tap((permission) => {
                this.permissionsStore.updatePermission(permission);
                this.permissionsStore.setLoading(false);
            }),
            catchError((error) => {
                this.permissionsStore.setError(error.message || 'Failed to update permission');
                return throwError(() => error);
            })
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
            })
        );
    }

    selectPermission(permission: Permission | null): void {
        this.permissionsStore.setSelectedPermission(permission);
    }

    clearError(): void {
        this.permissionsStore.setError(null);
    }
}
