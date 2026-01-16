import { Injectable, signal, computed } from '@angular/core';
import { AuthState, User } from '../../core/models';

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    // State
    private state = signal<AuthState>(initialState);

    // Selectors (computed signals)
    currentUser = computed(() => this.state().user);
    accessToken = computed(() => this.state().accessToken);
    refreshToken = computed(() => this.state().refreshToken);
    isAuthenticated = computed(() => this.state().isAuthenticated);
    loading = computed(() => this.state().loading);
    error = computed(() => this.state().error);

    // Mutations
    setLoading(loading: boolean): void {
        this.state.update((state) => ({ ...state, loading }));
    }

    setError(error: string | null): void {
        this.state.update((state) => ({ ...state, error, loading: false }));
    }

    setAuth(user: User, accessToken: string, refreshToken: string): void {
        this.state.update((state) => ({
            ...state,
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            loading: false,
            error: null
        }));
    }

    updateUser(user: User): void {
        this.state.update((state) => ({ ...state, user }));
    }

    clearAuth(): void {
        this.state.set(initialState);
    }

    updateTokens(accessToken: string, refreshToken: string): void {
        this.state.update((state) => ({
            ...state,
            accessToken,
            refreshToken
        }));
    }
}
