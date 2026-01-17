import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { Permission, Role } from '../../../core/models';
import { PermissionsFacade } from '../../../data-access/permissions/permissions.facade';

@Component({
    selector: 'app-assign-permissions',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, CheckboxModule],
    templateUrl: './assign-permissions.component.html'
})
export class AssignPermissionsComponent implements OnInit, OnChanges {
    private permissionsFacade = inject(PermissionsFacade);

    @Input() role: Role | null = null;
    @Input() rolePermissions: Permission[] = [];
    @Output() save = new EventEmitter<number[]>();
    @Output() cancel = new EventEmitter<void>();

    permissions$ = this.permissionsFacade.permissions$;
    loading$ = this.permissionsFacade.loading$;

    selectedPermissions: Permission[] = [];

    constructor() {
        // Watch for changes in permissions and pre-select
        effect(() => {
            const permissions = this.permissions$();
            if (permissions.length > 0) {
                this.preselectPermissions(permissions);
            }
        });
    }

    ngOnInit(): void {
        this.permissionsFacade.loadPermissions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // When rolePermissions input changes, re-preselect
        if (changes['rolePermissions'] && !changes['rolePermissions'].firstChange) {
            const permissions = this.permissions$();
            if (permissions.length > 0) {
                this.preselectPermissions(permissions);
            }
        }
    }

    private preselectPermissions(allPermissions: Permission[]): void {
        if (this.rolePermissions.length === 0) {
            this.selectedPermissions = [];
            return;
        }

        const rolePermissionIds = new Set(this.rolePermissions.map((p) => p.id));
        this.selectedPermissions = allPermissions.filter((p) => rolePermissionIds.has(p.id));

        console.log('Pre-selecting permissions:', {
            rolePermissionIds: Array.from(rolePermissionIds),
            selectedCount: this.selectedPermissions.length,
            totalPermissions: allPermissions.length
        });
    }

    onSave(): void {
        const selectedIds = this.selectedPermissions.map((p) => p.id);
        this.save.emit(selectedIds);
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
