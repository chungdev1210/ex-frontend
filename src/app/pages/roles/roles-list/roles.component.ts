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
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RolesFacade } from '../../../data-access/roles/roles.facade';
import { Role } from '../../../core/models';
import { RoleFormComponent } from '../role-form/role-form.component';
import { AssignPermissionsComponent } from '../assign-permissions/assign-permissions.component';

@Component({
    selector: 'app-roles',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule, ConfirmDialogModule, TagModule, BadgeModule, TooltipModule, RoleFormComponent, AssignPermissionsComponent],
    providers: [MessageService, ConfirmationService],
    templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
    private rolesFacade = inject(RolesFacade);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    roles$ = this.rolesFacade.roles$;
    loading$ = this.rolesFacade.loading$;
    rolePermissions$ = this.rolesFacade.rolePermissions$;

    dialogVisible = false;
    permissionsDialogVisible = false;
    dialogMode = signal<'create' | 'edit'>('create');
    selectedRole = signal<Role | null>(null);

    ngOnInit(): void {
        this.rolesFacade.loadRoles();
    }

    openNew(): void {
        this.selectedRole.set(null);
        this.dialogMode.set('create');
        this.dialogVisible = true;
    }

    edit(role: Role): void {
        this.selectedRole.set(role);
        this.dialogMode.set('edit');
        this.dialogVisible = true;
    }

    assignPermissions(role: Role): void {
        this.selectedRole.set(role);
        this.rolesFacade.loadRolePermissions(role.id);
        this.permissionsDialogVisible = true;
    }

    delete(role: Role): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete role "${role.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.rolesFacade.deleteRole(role.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Role deleted successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.error?.message || 'Failed to delete role'
                        });
                    }
                });
            }
        });
    }

    onSave(data: any): void {
        const action = this.dialogMode() === 'create' ? this.rolesFacade.createRole(data) : this.rolesFacade.updateRole(this.selectedRole()!.id, data);

        action.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Role ${this.dialogMode() === 'create' ? 'created' : 'updated'} successfully`
                });
                this.hideDialog();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || `Failed to ${this.dialogMode()} role`
                });
            }
        });
    }

    onSavePermissions(permissionIds: number[]): void {
        const role = this.selectedRole();
        if (!role) return;

        this.rolesFacade.assignPermissions(role.id, { permissionIds }).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Permissions assigned successfully'
                });
                this.hidePermissionsDialog();
                this.rolesFacade.loadRoles();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Failed to assign permissions'
                });
            }
        });
    }

    hideDialog(): void {
        this.dialogVisible = false;
        this.selectedRole.set(null);
    }

    hidePermissionsDialog(): void {
        this.permissionsDialogVisible = false;
        this.selectedRole.set(null);
    }
}
