import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PermissionsFacade } from '../../../data-access/permissions/permissions.facade';
import { Permission } from '../../../core/models';
import { PermissionFormComponent } from '../permission-form/permission-form.component';

@Component({
    selector: 'app-permissions',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule, ConfirmDialogModule, TagModule, PermissionFormComponent],
    providers: [MessageService, ConfirmationService],
    templateUrl: './permissions.component.html'
})
export class PermissionsComponent implements OnInit {
    private permissionsFacade = inject(PermissionsFacade);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    permissions$ = this.permissionsFacade.permissions$;
    loading$ = this.permissionsFacade.loading$;

    dialogVisible = false;
    dialogMode = signal<'create' | 'edit'>('create');
    selectedPermission = signal<Permission | null>(null);

    ngOnInit(): void {
        this.permissionsFacade.loadPermissions();
    }

    openNew(): void {
        this.selectedPermission.set(null);
        this.dialogMode.set('create');
        this.dialogVisible = true;
    }

    edit(permission: Permission): void {
        this.selectedPermission.set(permission);
        this.dialogMode.set('edit');
        this.dialogVisible = true;
    }

    delete(permission: Permission): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete permission "${permission.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.permissionsFacade.deletePermission(permission.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Permission deleted successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.error?.message || 'Failed to delete permission'
                        });
                    }
                });
            }
        });
    }

    onSave(data: any): void {
        const action = this.dialogMode() === 'create' ? this.permissionsFacade.createPermission(data) : this.permissionsFacade.updatePermission(this.selectedPermission()!.id, data);

        action.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Permission ${this.dialogMode() === 'create' ? 'created' : 'updated'} successfully`
                });
                this.hideDialog();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || `Failed to ${this.dialogMode()} permission`
                });
            }
        });
    }

    hideDialog(): void {
        this.dialogVisible = false;
        this.selectedPermission.set(null);
    }

    getMethodSeverity(method: string | undefined): string {
        const severityMap: Record<string, string> = {
            GET: 'info',
            POST: 'success',
            PUT: 'warn',
            PATCH: 'warn',
            DELETE: 'danger'
        };
        return severityMap[method || ''] || 'secondary';
    }
}
