import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission, CreatePermissionDto, UpdatePermissionDto, ApiResponse } from '../../core/models';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/permissions`;

    getAll(): Observable<ApiResponse<Permission[]>> {
        return this.http.get<ApiResponse<Permission[]>>(this.apiUrl);
    }

    getById(id: number): Observable<ApiResponse<Permission>> {
        return this.http.get<ApiResponse<Permission>>(`${this.apiUrl}/${id}`);
    }

    create(dto: CreatePermissionDto): Observable<ApiResponse<Permission>> {
        return this.http.post<ApiResponse<Permission>>(this.apiUrl, dto);
    }

    update(id: number, dto: UpdatePermissionDto): Observable<ApiResponse<Permission>> {
        return this.http.put<ApiResponse<Permission>>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
