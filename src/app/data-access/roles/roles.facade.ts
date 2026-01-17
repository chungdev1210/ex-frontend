import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { RolesService } from './roles.service';
import { RolesStore } from './roles.store';
import { Role, CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from '../../core/models';

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

    // Actions
    loadRoles(): void {
        this.rolesStore.setLoading(true);
        this.rolesService.getAll().subscribe({
            next: (response) => {
                this.rolesStore.setRoles(response.results);
            },
            error: (error) => {
                this.rolesStore.setError(error.message || 'Failed to load roles');
            }
        });
    }

    loadRoleById(id: number): void {
        this.rolesStore.setLoading(true);
        this.rolesService.getById(id).subscribe({
            next: (response) => {
                this.rolesStore.setSelectedRole(response.results);
                this.rolesStore.setLoading(false);
            },
            error: (error) => {
                this.rolesStore.setError(error.message || 'Failed to load role');
            }
        });
    }

    loadRolePermissions(id: number): void {
        this.rolesService.getPermissions(id).subscribe({
            next: (response) => {
                this.rolesStore.setRolePermissions(response.results);
            },
            error: (error) => {
                this.rolesStore.setError(error.message || 'Failed to load role permissions');
            }
        });
    }

    createRole(dto: CreateRoleDto): Observable<void> {
        this.rolesStore.setLoading(true);
        return this.rolesService.create(dto).pipe(
            tap((response) => {
                this.rolesStore.addRole(response.results);
                this.rolesStore.setLoading(false);
            }),
            catchError((error) => {
                this.rolesStore.setError(error.message || 'Failed to create role');
                return throwError(() => error);
            }),
            map(() => void 0)
        );
    }

    updateRole(id: number, dto: UpdateRoleDto): Observable<void> {
        this.rolesStore.setLoading(true);
        return this.rolesService.update(id, dto).pipe(
            tap((response) => {
                this.rolesStore.updateRole(response.results);
                this.rolesStore.setLoading(false);
            }),
            catchError((error) => {
                this.rolesStore.setError(error.message || 'Failed to update role');
                return throwError(() => error);
            }),
            map(() => void 0)
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
            }),
            map(() => void 0)
        );
    }

    assignPermissions(id: number, dto: AssignPermissionsDto): Observable<void> {
        this.rolesStore.setLoading(true);
        return this.rolesService.assignPermissions(id, dto).pipe(
            tap(() => {
                this.loadRoleById(id);
                this.loadRolePermissions(id);
            }),
            catchError((error) => {
                this.rolesStore.setError(error.message || 'Failed to assign permissions');
                return throwError(() => error);
            }),
            map(() => void 0)
        );
    }

    selectRole(role: Role | null): void {
        this.rolesStore.setSelectedRole(role);
    }

    clearError(): void {
        this.rolesStore.setError(null);
    }
}
