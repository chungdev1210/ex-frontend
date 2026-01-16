import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { UsersStore } from './users.store';
import { User, CreateUserDto, UpdateUserDto, ChangePasswordDto, UserQueryParams, AssignRolesDto, ChangePasswordResponse } from '../../core/models';
import { TokenService } from '@/core/services/token.service';

@Injectable({
    providedIn: 'root'
})
export class UsersFacade {
    private usersService = inject(UsersService);
    private usersStore = inject(UsersStore);
    private tokenService = inject(TokenService);

    // Expose selectors
    users$ = this.usersStore.users;
    selectedUser$ = this.usersStore.selectedUser;
    availableRoles$ = this.usersStore.availableRoles;
    loading$ = this.usersStore.loading;
    error$ = this.usersStore.error;
    totalCount$ = this.usersStore.totalCount;

    // Actions
    loadUsers(params?: UserQueryParams): void {
        this.usersStore.setLoading(true);
        this.usersService.getAll(params).subscribe({
            next: (result) => {
                this.usersStore.setUsers(result.items, result.totalCount);
            },
            error: (error) => {
                this.usersStore.setError(error.message || 'Failed to load users');
            }
        });
    }

    loadUserById(id: number): void {
        this.usersStore.setLoading(true);
        this.usersService.getById(id).subscribe({
            next: (user) => {
                this.usersStore.setSelectedUser(user);
                this.usersStore.setLoading(false);
            },
            error: (error) => {
                this.usersStore.setError(error.message || 'Failed to load user');
            }
        });
    }

    createUser(dto: CreateUserDto): Observable<User> {
        this.usersStore.setLoading(true);
        return this.usersService.create(dto).pipe(
            tap((user) => {
                this.usersStore.addUser(user);
                this.usersStore.setLoading(false);
            }),
            catchError((error) => {
                this.usersStore.setError(error.message || 'Failed to create user');
                return throwError(() => error);
            })
        );
    }

    updateUser(id: number, dto: UpdateUserDto): Observable<User> {
        this.usersStore.setLoading(true);
        return this.usersService.update(id, dto).pipe(
            tap((user) => {
                this.usersStore.updateUser(user);
                this.usersStore.setLoading(false);
            }),
            catchError((error) => {
                this.usersStore.setError(error.message || 'Failed to update user');
                return throwError(() => error);
            })
        );
    }

    deleteUser(id: number): Observable<void> {
        this.usersStore.setLoading(true);
        return this.usersService.delete(id).pipe(
            tap(() => {
                this.usersStore.removeUser(id);
                this.usersStore.setLoading(false);
            }),
            catchError((error) => {
                this.usersStore.setError(error.message || 'Failed to delete user');
                return throwError(() => error);
            })
        );
    }

    uploadAvatar(id: number, file: File): Observable<User> {
        this.usersStore.setLoading(true);
        return this.usersService.uploadAvatar(id, file).pipe(
            tap((user) => {
                this.usersStore.updateUser(user);
                this.usersStore.setLoading(false);
            }),
            catchError((error) => {
                this.usersStore.setError(error.message || 'Failed to upload avatar');
                return throwError(() => error);
            })
        );
    }

    changePassword(dto: ChangePasswordDto): Observable<ChangePasswordResponse> {
        this.usersStore.setLoading(true);
        return this.usersService.changePassword(dto).pipe(
            tap((response) => {
                this.tokenService.saveTokens(response.results.accessToken, response.results.refreshToken);
                this.usersStore.setLoading(false);
            }),
            catchError((error) => {
                this.usersStore.setError(error.message || 'Failed to change password');
                return throwError(() => error);
            })
        );
    }

    loadAvailableRoles(): void {
        this.usersService.getAllRoles().subscribe({
            next: (roles) => {
                this.usersStore.setAvailableRoles(roles);
            },
            error: (error) => {
                this.usersStore.setError(error.message || 'Failed to load roles');
            }
        });
    }

    assignRoles(id: number, dto: AssignRolesDto): Observable<void> {
        this.usersStore.setLoading(true);
        return this.usersService.assignRoles(id, dto).pipe(
            tap(() => {
                // Reload user to get updated roles
                this.loadUserById(id);
            }),
            catchError((error) => {
                this.usersStore.setError(error.message || 'Failed to assign roles');
                return throwError(() => error);
            })
        );
    }

    selectUser(user: User | null): void {
        this.usersStore.setSelectedUser(user);
    }

    clearError(): void {
        this.usersStore.setError(null);
    }
}
