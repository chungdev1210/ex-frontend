import { Injectable, signal } from '@angular/core';
import { Role, Permission } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class RolesStore {
    private _roles = signal<Role[]>([]);
    private _selectedRole = signal<Role | null>(null);
    private _rolePermissions = signal<Permission[]>([]);
    private _loading = signal<boolean>(false);
    private _error = signal<string | null>(null);

    // Selectors
    roles = this._roles.asReadonly();
    selectedRole = this._selectedRole.asReadonly();
    rolePermissions = this._rolePermissions.asReadonly();
    loading = this._loading.asReadonly();
    error = this._error.asReadonly();

    // Actions
    setRoles(roles: Role[]): void {
        this._roles.set(roles);
        this._loading.set(false);
    }

    setSelectedRole(role: Role | null): void {
        this._selectedRole.set(role);
    }

    setRolePermissions(permissions: Permission[]): void {
        this._rolePermissions.set(permissions);
    }

    addRole(role: Role): void {
        this._roles.update((roles) => [...roles, role]);
    }

    updateRole(updated: Role): void {
        this._roles.update((roles) => roles.map((r) => (r.id === updated.id ? updated : r)));
    }

    removeRole(id: number): void {
        this._roles.update((roles) => roles.filter((r) => r.id !== id));
    }

    setLoading(loading: boolean): void {
        this._loading.set(loading);
    }

    setError(error: string | null): void {
        this._error.set(error);
        this._loading.set(false);
    }
}
