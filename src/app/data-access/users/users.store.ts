import { Injectable, signal, computed } from '@angular/core';
import { User, Role } from '../../core/models';

interface UsersState {
    users: User[];
    selectedUser: User | null;
    availableRoles: Role[];
    loading: boolean;
    error: string | null;
    totalCount: number;
}

const initialState: UsersState = {
    users: [],
    selectedUser: null,
    availableRoles: [],
    loading: false,
    error: null,
    totalCount: 0
};

@Injectable({
    providedIn: 'root'
})
export class UsersStore {
    // State
    private state = signal<UsersState>(initialState);

    // Selectors
    users = computed(() => this.state().users);
    selectedUser = computed(() => this.state().selectedUser);
    availableRoles = computed(() => this.state().availableRoles);
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

    setUsers(users: User[], totalCount: number): void {
        this.state.update((state) => ({
            ...state,
            users,
            totalCount,
            loading: false,
            error: null
        }));
    }

    setSelectedUser(user: User | null): void {
        this.state.update((state) => ({ ...state, selectedUser: user }));
    }

    addUser(user: User): void {
        this.state.update((state) => ({
            ...state,
            users: [...state.users, user],
            totalCount: state.totalCount + 1
        }));
    }

    updateUser(user: User): void {
        this.state.update((state) => ({
            ...state,
            users: state.users.map((u) => (u.id === user.id ? user : u)),
            selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser
        }));
    }

    removeUser(id: number): void {
        this.state.update((state) => ({
            ...state,
            users: state.users.filter((u) => u.id !== id),
            totalCount: state.totalCount - 1,
            selectedUser: state.selectedUser?.id === id ? null : state.selectedUser
        }));
    }

    setAvailableRoles(roles: Role[]): void {
        this.state.update((state) => ({ ...state, availableRoles: roles }));
    }

    reset(): void {
        this.state.set(initialState);
    }
}
