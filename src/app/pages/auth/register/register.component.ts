import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthFacade } from '../../../data-access/auth/auth.facade';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authFacade = inject(AuthFacade);
    private messageService = inject(MessageService);
    private router = inject(Router);

    loading = this.authFacade.loading;

    registerForm: FormGroup = this.fb.group({
        userName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
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
                this.router.navigate(['/auth/login'], {
                    state: {
                        registrationSuccess: true,
                        userName: userName,
                        password: password
                    }
                });
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
