import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role, CreateRoleDto, UpdateRoleDto, AssignPermissionsDto, Permission, ApiResponse } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class RolesService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/roles`;

    getAll(): Observable<ApiResponse<Role[]>> {
        return this.http.get<ApiResponse<Role[]>>(this.apiUrl);
    }

    getById(id: number): Observable<ApiResponse<Role>> {
        return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`);
    }

    create(dto: CreateRoleDto): Observable<ApiResponse<Role>> {
        return this.http.post<ApiResponse<Role>>(this.apiUrl, dto);
    }

    update(id: number, dto: UpdateRoleDto): Observable<ApiResponse<Role>> {
        return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }

    getPermissions(id: number): Observable<ApiResponse<Permission[]>> {
        return this.http.get<ApiResponse<Permission[]>>(`${this.apiUrl}/${id}/permissions`);
    }

    assignPermissions(id: number, dto: AssignPermissionsDto): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/permissions`, dto);
    }
}
