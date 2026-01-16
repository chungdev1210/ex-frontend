import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api.config';
import { Role, CreateRoleDto, UpdateRoleDto, RoleQueryParams, AssignPermissionsDto, Permission, PagedResult } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class RolesService {
    private http = inject(HttpClient);
    private baseUrl = API_CONFIG.baseUrl;

    getAll(params?: RoleQueryParams): Observable<PagedResult<Role>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                const value = params[key as keyof RoleQueryParams];
                if (value !== undefined && value !== null) {
                    httpParams = httpParams.set(key, value.toString());
                }
            });
        }
        return this.http.get<PagedResult<Role>>(`${this.baseUrl}${API_CONFIG.endpoints.roles.base}`, { params: httpParams });
    }

    getById(id: number): Observable<Role> {
        return this.http.get<Role>(`${this.baseUrl}${API_CONFIG.endpoints.roles.byId(id)}`);
    }

    create(dto: CreateRoleDto): Observable<Role> {
        return this.http.post<Role>(`${this.baseUrl}${API_CONFIG.endpoints.roles.base}`, dto);
    }

    update(id: number, dto: UpdateRoleDto): Observable<Role> {
        return this.http.put<Role>(`${this.baseUrl}${API_CONFIG.endpoints.roles.byId(id)}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}${API_CONFIG.endpoints.roles.byId(id)}`);
    }

    getPermissions(id: number): Observable<Permission[]> {
        return this.http.get<Permission[]>(`${this.baseUrl}${API_CONFIG.endpoints.roles.permissions(id)}`);
    }

    assignPermissions(id: number, dto: AssignPermissionsDto): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}${API_CONFIG.endpoints.roles.assignPermissions(id)}`, dto);
    }
}
