import { Injectable, signal, computed } from '@angular/core';
import { Permission } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class PermissionsStore {
    private _permissions = signal<Permission[]>([]);
    private _selectedPermission = signal<Permission | null>(null);
    private _loading = signal<boolean>(false);
    private _error = signal<string | null>(null);

    // Selectors
    permissions = this._permissions.asReadonly();
    selectedPermission = this._selectedPermission.asReadonly();
    loading = this._loading.asReadonly();
    error = this._error.asReadonly();

    // Actions
    setPermissions(permissions: Permission[]): void {
        this._permissions.set(permissions);
        this._loading.set(false);
    }

    setSelectedPermission(permission: Permission | null): void {
        this._selectedPermission.set(permission);
    }

    addPermission(permission: Permission): void {
        this._permissions.update((permissions) => [...permissions, permission]);
    }

    updatePermission(updated: Permission): void {
        this._permissions.update((permissions) => permissions.map((p) => (p.id === updated.id ? updated : p)));
    }

    removePermission(id: number): void {
        this._permissions.update((permissions) => permissions.filter((p) => p.id !== id));
    }

    setLoading(loading: boolean): void {
        this._loading.set(loading);
    }

    setError(error: string | null): void {
        this._error.set(error);
        this._loading.set(false);
    }
}
