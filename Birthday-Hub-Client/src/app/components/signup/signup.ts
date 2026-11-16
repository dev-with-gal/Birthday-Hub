import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SignupService, SignupServiceError, SignupServiceErrorCode } from '../../services/signup.service';
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
  private readonly signupService = inject(SignupService);
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
    this.signupService
      .signup(email, password)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/'),
        error: (error: unknown) => {
          const errorCode: SignupServiceErrorCode =
            error instanceof SignupServiceError ? error.code : 'unknown';
          this.errorMessage.set(this.getErrorMessage(errorCode));
        },
      });
  }

  private getErrorMessage(errorCode: SignupServiceErrorCode): string {
    switch (errorCode) {
      case 'emailExists':
        return this.text.signup.emailExists;
      case 'invalidForm':
        return this.text.signup.invalidForm;
      case 'unknown':
        return this.text.signup.error;
    }
  }
}
