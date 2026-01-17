import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Role } from '../../../core/models';

@Component({
    selector: 'app-role-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Textarea, InputNumberModule, ToggleSwitch],
    templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);

    @Input() role: Role | null = null;
    @Input() mode: 'create' | 'edit' = 'create';
    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        priority: [0],
        isActive: [true]
    });

    ngOnInit(): void {
        this.loadRoleData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['role'] && !changes['role'].firstChange) {
            this.loadRoleData();
        }
    }

    private loadRoleData(): void {
        if (this.role) {
            this.form.patchValue({
                name: this.role.name,
                description: this.role.description || '',
                priority: this.role.priority || 0,
                isActive: this.role.isActive
            });
        } else {
            this.form.reset({
                name: '',
                description: '',
                priority: 0,
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
