import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthFacade } from '../../data-access/auth/auth.facade';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome Back!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
                            <div class="mb-8">
                                <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                <input
                                    pInputText
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    class="w-full md:w-120"
                                    formControlName="userName"
                                    [class.ng-invalid]="loginForm.get('userName')?.invalid && loginForm.get('userName')?.touched"
                                    [class.ng-dirty]="loginForm.get('userName')?.touched"
                                />
                                @if (loginForm.get('userName')?.invalid && loginForm.get('userName')?.touched) {
                                    <small class="text-red-500 block mt-1">Username is required</small>
                                }
                            </div>

                            <div class="mb-4">
                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                <p-password
                                    id="password"
                                    formControlName="password"
                                    placeholder="Password"
                                    [toggleMask]="true"
                                    [fluid]="true"
                                    [feedback]="false"
                                    [class.ng-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                                    [class.ng-dirty]="loginForm.get('password')?.touched"
                                >
                                </p-password>
                                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                                    <small class="text-red-500 block mt-1">Password is required</small>
                                }
                            </div>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox formControlName="rememberMe" id="rememberme" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>

                            <p-button label="Sign In" styleClass="w-full" type="submit" [loading]="loading()" [disabled]="loginForm.invalid"></p-button>

                            <div class="text-center mt-6">
                                <span class="text-muted-color">Don't have an account? </span>
                                <a routerLink="/auth/register" class="font-medium text-primary cursor-pointer">Sign Up</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    private fb = inject(FormBuilder);
    private authFacade = inject(AuthFacade);
    private messageService = inject(MessageService);
    private router = inject(Router);

    loading = this.authFacade.loading;

    loginForm: FormGroup = this.fb.group({
        userName: ['', [Validators.required]],
        password: ['', [Validators.required]],
        rememberMe: [false]
    });

    onLogin(): void {
        if (this.loginForm.invalid) {
            Object.keys(this.loginForm.controls).forEach((key) => {
                this.loginForm.get(key)?.markAsTouched();
            });
            return;
        }

        const { userName, password } = this.loginForm.value;

        this.authFacade.login({ userName, password }).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Login successful'
                });
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failed',
                    detail: err.error?.message || 'Invalid credentials'
                });
            }
        });
    }
}
