import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api.config';
import { User, CreateUserDto, UpdateUserDto, ChangePasswordDto, UserQueryParams, AssignRolesDto, PagedResult, Role, ChangePasswordResponse } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private http = inject(HttpClient);
    private baseUrl = API_CONFIG.baseUrl;

    getAll(params?: UserQueryParams): Observable<PagedResult<User>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                const value = params[key as keyof UserQueryParams];
                if (value !== undefined && value !== null) {
                    httpParams = httpParams.set(key, value.toString());
                }
            });
        }
        return this.http.get<PagedResult<User>>(`${this.baseUrl}${API_CONFIG.endpoints.users.base}`, { params: httpParams });
    }

    getById(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}${API_CONFIG.endpoints.users.byId(id)}`);
    }

    create(dto: CreateUserDto): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}${API_CONFIG.endpoints.users.base}`, dto);
    }

    update(id: number, dto: UpdateUserDto): Observable<User> {
        return this.http.patch<User>(`${this.baseUrl}${API_CONFIG.endpoints.users.byId(id)}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}${API_CONFIG.endpoints.users.byId(id)}`);
    }

    uploadAvatar(id: number, file: File): Observable<User> {
        const formData = new FormData();
        formData.append('avatar', file);
        return this.http.post<User>(`${this.baseUrl}${API_CONFIG.endpoints.users.uploadAvatar(id)}`, formData);
    }

    changePassword(dto: ChangePasswordDto): Observable<ChangePasswordResponse> {
        return this.http.patch<ChangePasswordResponse>(`${this.baseUrl}${API_CONFIG.endpoints.users.changePassword}`, dto);
    }

    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.baseUrl}${API_CONFIG.endpoints.users.roles}`);
    }

    getUserRoles(id: number): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.baseUrl}${API_CONFIG.endpoints.users.userRoles(id)}`);
    }

    assignRoles(id: number, dto: AssignRolesDto): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}${API_CONFIG.endpoints.users.assignRoles(id)}`, dto);
    }
}
