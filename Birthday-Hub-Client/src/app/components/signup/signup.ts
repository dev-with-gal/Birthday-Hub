import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersApiService } from '../../services/users-api.service';
import { he } from '../../i18n/he';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-signup',
  styleUrl: './signup.scss',
  templateUrl: './signup.html',
})
export class Signup {
  readonly text = he;
  private readonly formBuilder = inject(FormBuilder);
  private readonly usersApi = inject(UsersApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    confirmPassword: ['', Validators.required],
  });
  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);

  submit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.errorMessage.set(this.text.signup.passwordMismatch);
      return;
    }

    this.isSubmitting.set(true);
    this.usersApi
      .create({ email, password })
      .pipe(
        switchMap(() => this.auth.login({ email, password })),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: (session) => {
          this.auth.startSession(session);
          void this.router.navigateByUrl('/');
        },
        error: (error: { status?: number }) => {
          this.errorMessage.set(
            error.status === 409
              ? this.text.signup.emailExists
              : error.status === 400
                ? this.text.signup.invalidForm
                : this.text.signup.error,
          );
        },
      });
  }
}
