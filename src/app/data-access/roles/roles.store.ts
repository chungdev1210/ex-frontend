import { Injectable, signal, computed } from '@angular/core';
import { Role, Permission } from '../../core/models';

interface RolesState {
    roles: Role[];
    selectedRole: Role | null;
    rolePermissions: Permission[];
    loading: boolean;
    error: string | null;
    totalCount: number;
}

const initialState: RolesState = {
    roles: [],
    selectedRole: null,
    rolePermissions: [],
    loading: false,
    error: null,
    totalCount: 0
};

@Injectable({
    providedIn: 'root'
})
export class RolesStore {
    // State
    private state = signal<RolesState>(initialState);

    // Selectors
    roles = computed(() => this.state().roles);
    selectedRole = computed(() => this.state().selectedRole);
    rolePermissions = computed(() => this.state().rolePermissions);
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

    setRoles(roles: Role[], totalCount: number): void {
        this.state.update((state) => ({
            ...state,
            roles,
            totalCount,
            loading: false,
            error: null
        }));
    }

    setSelectedRole(role: Role | null): void {
        this.state.update((state) => ({ ...state, selectedRole: role }));
    }

    setRolePermissions(permissions: Permission[]): void {
        this.state.update((state) => ({ ...state, rolePermissions: permissions }));
    }

    addRole(role: Role): void {
        this.state.update((state) => ({
            ...state,
            roles: [...state.roles, role],
            totalCount: state.totalCount + 1
        }));
    }

    updateRole(role: Role): void {
        this.state.update((state) => ({
            ...state,
            roles: state.roles.map((r) => (r.id === role.id ? role : r)),
            selectedRole: state.selectedRole?.id === role.id ? role : state.selectedRole
        }));
    }

    removeRole(id: number): void {
        this.state.update((state) => ({
            ...state,
            roles: state.roles.filter((r) => r.id !== id),
            totalCount: state.totalCount - 1,
            selectedRole: state.selectedRole?.id === id ? null : state.selectedRole
        }));
    }

    reset(): void {
        this.state.set(initialState);
    }
}
