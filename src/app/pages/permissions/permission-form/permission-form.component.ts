import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Permission } from '../../../core/models';

@Component({
    selector: 'app-permission-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Textarea, Select, ToggleSwitch],
    templateUrl: './permission-form.component.html'
})
export class PermissionFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);

    @Input() permission: Permission | null = null;
    @Input() mode: 'create' | 'edit' = 'create';
    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    httpMethods = [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'PATCH', value: 'PATCH' },
        { label: 'DELETE', value: 'DELETE' }
    ];

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        routePath: [''],
        method: [''],
        isActive: [true]
    });

    ngOnInit(): void {
        this.loadPermissionData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['permission'] && !changes['permission'].firstChange) {
            this.loadPermissionData();
        }
    }

    private loadPermissionData(): void {
        if (this.permission) {
            this.form.patchValue({
                name: this.permission.name,
                description: this.permission.description || '',
                routePath: this.permission.routePath || '',
                method: this.permission.method || '',
                isActive: this.permission.isActive
            });
        } else {
            this.form.reset({
                name: '',
                description: '',
                routePath: '',
                method: '',
                isActive: true
            });
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.save.emit(this.form.value);
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
