import { Injectable, signal, computed } from '@angular/core';
import { Permission } from '../../core/models';

interface PermissionsState {
    permissions: Permission[];
    selectedPermission: Permission | null;
    loading: boolean;
    error: string | null;
    totalCount: number;
}

const initialState: PermissionsState = {
    permissions: [],
    selectedPermission: null,
    loading: false,
    error: null,
    totalCount: 0
};

@Injectable({
    providedIn: 'root'
})
export class PermissionsStore {
    // State
    private state = signal<PermissionsState>(initialState);

    // Selectors
    permissions = computed(() => this.state().permissions);
    selectedPermission = computed(() => this.state().selectedPermission);
    loading = computed(() => this.state().loading);
    error = computed(() => this.state().error);
    totalCount = computed(() => this.state().totalCount);

    // Mutations
    setLoading(loading: boolean): void {
        this.state.update((state) => ({ ...state, loading }));
    }

    setError(error: string | null): void {
        this.state.update((state) => ({ ...state, error, loading: false }));
    }

    setPermissions(permissions: Permission[], totalCount: number): void {
        this.state.update((state) => ({
            ...state,
            permissions,
            totalCount,
            loading: false,
            error: null
        }));
    }

    setSelectedPermission(permission: Permission | null): void {
        this.state.update((state) => ({ ...state, selectedPermission: permission }));
    }

    addPermission(permission: Permission): void {
        this.state.update((state) => ({
            ...state,
            permissions: [...state.permissions, permission],
            totalCount: state.totalCount + 1
        }));
    }

    updatePermission(permission: Permission): void {
        this.state.update((state) => ({
            ...state,
            permissions: state.permissions.map((p) => (p.id === permission.id ? permission : p)),
            selectedPermission: state.selectedPermission?.id === permission.id ? permission : state.selectedPermission
        }));
    }

    removePermission(id: number): void {
        this.state.update((state) => ({
            ...state,
            permissions: state.permissions.filter((p) => p.id !== id),
            totalCount: state.totalCount - 1,
            selectedPermission: state.selectedPermission?.id === id ? null : state.selectedPermission
        }));
    }

    reset(): void {
        this.state.set(initialState);
    }
}
