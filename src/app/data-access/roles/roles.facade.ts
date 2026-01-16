import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { RolesService } from './roles.service';
import { RolesStore } from './roles.store';
import { Role, CreateRoleDto, UpdateRoleDto, RoleQueryParams, AssignPermissionsDto } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class RolesFacade {
    private rolesService = inject(RolesService);
    private rolesStore = inject(RolesStore);

    // Expose selectors
    roles$ = this.rolesStore.roles;
    selectedRole$ = this.rolesStore.selectedRole;
    rolePermissions$ = this.rolesStore.rolePermissions;
    loading$ = this.rolesStore.loading;
    error$ = this.rolesStore.error;
    totalCount$ = this.rolesStore.totalCount;

    // Actions
    loadRoles(params?: RoleQueryParams): void {
        this.rolesStore.setLoading(true);
        this.rolesService.getAll(params).subscribe({
            next: (result) => {
                this.rolesStore.setRoles(result.items, result.totalCount);
            },
            error: (error) => {
                this.rolesStore.setError(error.message || 'Failed to load roles');
            }
        });
    }

    loadRoleById(id: number): void {
        this.rolesStore.setLoading(true);
        this.rolesService.getById(id).subscribe({
            next: (role) => {
                this.rolesStore.setSelectedRole(role);
                this.rolesStore.setLoading(false);
            },
            error: (error) => {
                this.rolesStore.setError(error.message || 'Failed to load role');
            }
        });
    }

    createRole(dto: CreateRoleDto): Observable<Role> {
        this.rolesStore.setLoading(true);
        return this.rolesService.create(dto).pipe(
            tap((role) => {
                this.rolesStore.addRole(role);
                this.rolesStore.setLoading(false);
            }),
            catchError((error) => {
                this.rolesStore.setError(error.message || 'Failed to create role');
                return throwError(() => error);
            })
        );
    }

    updateRole(id: number, dto: UpdateRoleDto): Observable<Role> {
        this.rolesStore.setLoading(true);
        return this.rolesService.update(id, dto).pipe(
            tap((role) => {
                this.rolesStore.updateRole(role);
                this.rolesStore.setLoading(false);
            }),
            catchError((error) => {
                this.rolesStore.setError(error.message || 'Failed to update role');
                return throwError(() => error);
            })
        );
    }

    deleteRole(id: number): Observable<void> {
        this.rolesStore.setLoading(true);
        return this.rolesService.delete(id).pipe(
            tap(() => {
                this.rolesStore.removeRole(id);
                this.rolesStore.setLoading(false);
            }),
            catchError((error) => {
                this.rolesStore.setError(error.message || 'Failed to delete role');
                return throwError(() => error);
            })
        );
    }

    loadRolePermissions(id: number): void {
        this.rolesService.getPermissions(id).subscribe({
            next: (permissions) => {
                this.rolesStore.setRolePermissions(permissions);
            },
            error: (error) => {
                this.rolesStore.setError(error.message || 'Failed to load permissions');
            }
        });
    }

    assignPermissions(id: number, dto: AssignPermissionsDto): Observable<void> {
        this.rolesStore.setLoading(true);
        return this.rolesService.assignPermissions(id, dto).pipe(
            tap(() => {
                // Reload role to get updated permissions
                this.loadRoleById(id);
                this.loadRolePermissions(id);
            }),
            catchError((error) => {
                this.rolesStore.setError(error.message || 'Failed to assign permissions');
                return throwError(() => error);
            })
        );
    }

    selectRole(role: Role | null): void {
        this.rolesStore.setSelectedRole(role);
    }

    clearError(): void {
        this.rolesStore.setError(null);
    }
}
