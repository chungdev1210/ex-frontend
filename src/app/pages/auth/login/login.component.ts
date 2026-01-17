import { Component, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthFacade } from '../../../data-access/auth/auth.facade';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewInit {
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

    ngAfterViewInit(): void {
        // Sử dụng setTimeout để đảm bảo state đã được set
        setTimeout(() => {
            const state = window.history.state;
            if (state?.registrationSuccess) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đăng ký tài khoản thành công'
                });

                // Fill username và password từ registration
                if (state.userName && state.password) {
                    this.loginForm.patchValue({
                        userName: state.userName,
                        password: state.password
                    });
                }
            }
        }, 0);
    }

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
