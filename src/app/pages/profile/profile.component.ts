import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthFacade } from '../../data-access/auth/auth.facade';
import { UsersFacade } from '../../data-access/users/users.facade';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, CardModule, InputTextModule, AvatarModule, PasswordModule, ToastModule],
    providers: [MessageService],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authFacade = inject(AuthFacade);
    private usersFacade = inject(UsersFacade);
    private messageService = inject(MessageService);

    currentUser = this.authFacade.currentUser;
    loading$ = this.usersFacade.loading$;
    showPasswordForm = signal(false);

    profileForm: FormGroup = this.fb.group({
        userName: [{ value: '', disabled: true }],
        email: [''],
        fullName: [''],
        password: this.fb.group(
            {
                currentPassword: ['', [Validators.required]],
                newPassword: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', [Validators.required]]
            },
            { validators: this.passwordMatchValidator }
        )
    });

    get passwordGroup(): FormGroup {
        return this.profileForm.get('password') as FormGroup;
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }

    ngOnInit(): void {
        this.loadUserData();
    }

    private loadUserData(): void {
        const user = this.currentUser();
        if (user) {
            this.profileForm.patchValue({
                userName: user.userName,
                email: user.email,
                fullName: user.fullName || ''
            });
        }
    }

    getInitials(): string {
        const user = this.currentUser();
        if (!user) return '?';
        const name = user.fullName || user.userName;
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    togglePasswordForm(): void {
        this.showPasswordForm.update((v) => !v);
        if (!this.showPasswordForm()) {
            this.passwordGroup.reset();
        }
    }

    cancelPasswordChange(): void {
        this.showPasswordForm.set(false);
        this.passwordGroup.reset();
    }

    onChangePassword(): void {
        if (this.passwordGroup.invalid) {
            Object.keys(this.passwordGroup.controls).forEach((key) => {
                this.passwordGroup.get(key)?.markAsTouched();
            });
            return;
        }

        const { currentPassword, newPassword, confirmPassword } = this.passwordGroup.value;

        this.usersFacade.changePassword({ currentPassword, newPassword }).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Password changed successfully'
                });
                this.cancelPasswordChange();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Failed to change password'
                });
            }
        });
    }

    onCancel(): void {
        this.loadUserData();
        this.cancelPasswordChange();
    }

    onSaveProfile(): void {
        const user = this.currentUser();
        if (!user) return;

        const { email, fullName } = this.profileForm.value;
        this.usersFacade.updateUser(user.id, { email, fullName }).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Profile updated successfully'
                });
                this.authFacade.checkAuthStatus();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Failed to update profile'
                });
            }
        });
    }

    onFileChange(event: Event): void {
        const user = this.currentUser();
        if (!user) return;

        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        this.usersFacade.uploadAvatar(user.id, file).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Avatar updated successfully'
                });
                this.authFacade.checkAuthStatus();
                input.value = '';
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Failed to upload avatar'
                });
            }
        });
    }
}
