import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api.config';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionQueryParams, PagedResult } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    private http = inject(HttpClient);
    private baseUrl = API_CONFIG.baseUrl;

    getAll(params?: PermissionQueryParams): Observable<PagedResult<Permission>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                const value = params[key as keyof PermissionQueryParams];
                if (value !== undefined && value !== null) {
                    httpParams = httpParams.set(key, value.toString());
                }
            });
        }
        return this.http.get<PagedResult<Permission>>(`${this.baseUrl}${API_CONFIG.endpoints.permissions.base}`, { params: httpParams });
    }

    getById(id: number): Observable<Permission> {
        return this.http.get<Permission>(`${this.baseUrl}${API_CONFIG.endpoints.permissions.byId(id)}`);
    }

    create(dto: CreatePermissionDto): Observable<Permission> {
        return this.http.post<Permission>(`${this.baseUrl}${API_CONFIG.endpoints.permissions.base}`, dto);
    }

    update(id: number, dto: UpdatePermissionDto): Observable<Permission> {
        return this.http.put<Permission>(`${this.baseUrl}${API_CONFIG.endpoints.permissions.byId(id)}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}${API_CONFIG.endpoints.permissions.byId(id)}`);
    }
}
