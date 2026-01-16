import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthFacade } from '../../data-access/auth/auth.facade';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create Account</div>
                            <span class="text-muted-color font-medium">Sign up to get started</span>
                        </div>

                        <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
                            <div class="mb-6">
                                <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                <input
                                    pInputText
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    class="w-full md:w-120"
                                    formControlName="userName"
                                    [class.ng-invalid]="registerForm.get('userName')?.invalid && registerForm.get('userName')?.touched"
                                    [class.ng-dirty]="registerForm.get('userName')?.touched"
                                />
                                @if (registerForm.get('userName')?.invalid && registerForm.get('userName')?.touched) {
                                    <small class="text-red-500 block mt-1">Username is required</small>
                                }
                            </div>

                            <div class="mb-6">
                                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input
                                    pInputText
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    class="w-full md:w-120"
                                    formControlName="email"
                                    [class.ng-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                                    [class.ng-dirty]="registerForm.get('email')?.touched"
                                />
                                @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                                    @if (registerForm.get('email')?.errors?.['required']) {
                                        <small class="text-red-500 block mt-1">Email is required</small>
                                    }
                                    @if (registerForm.get('email')?.errors?.['email']) {
                                        <small class="text-red-500 block mt-1">Invalid email format</small>
                                    }
                                }
                            </div>

                            <div class="mb-6">
                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                <p-password
                                    id="password"
                                    formControlName="password"
                                    placeholder="Password"
                                    [toggleMask]="true"
                                    [fluid]="true"
                                    [feedback]="false"
                                    [class.ng-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                                    [class.ng-dirty]="registerForm.get('password')?.touched"
                                >
                                </p-password>
                                @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                                    @if (registerForm.get('password')?.errors?.['required']) {
                                        <small class="text-red-500 block mt-1">Password is required</small>
                                    }
                                    @if (registerForm.get('password')?.errors?.['minlength']) {
                                        <small class="text-red-500 block mt-1">Password must be at least 6 characters</small>
                                    }
                                }
                            </div>

                            <!-- <div class="flex items-center mb-6">
                                <p-checkbox formControlName="acceptTerms" id="terms" binary class="mr-2"></p-checkbox>
                                <label for="terms" class="text-sm">I agree to the terms and conditions</label>
                            </div> -->
                            @if (registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched) {
                                <small class="text-red-500 block mb-4">You must accept the terms and conditions</small>
                            }

                            <p-button label="Sign Up" styleClass="w-full mb-6" type="submit" [loading]="loading()" [disabled]="registerForm.invalid"></p-button>

                            <div class="text-center">
                                <span class="text-muted-color">Already have an account? </span>
                                <a routerLink="/auth/login" class="font-medium text-primary cursor-pointer">Sign In</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Register {
    private fb = inject(FormBuilder);
    private authFacade = inject(AuthFacade);
    private messageService = inject(MessageService);
    private router = inject(Router);

    loading = this.authFacade.loading;

    registerForm: FormGroup = this.fb.group({
        userName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
        // acceptTerms: [false, [Validators.requiredTrue]]
    });

    onRegister(): void {
        if (this.registerForm.invalid) {
            Object.keys(this.registerForm.controls).forEach((key) => {
                this.registerForm.get(key)?.markAsTouched();
            });
            return;
        }
        const { userName, email, password } = this.registerForm.value;

        this.authFacade.register({ userName, email, password }).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Đăng ký tài khoản thành công'
                });
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failed',
                    detail: err.error?.message || 'Registration failed'
                });
            }
        });
    }
}
