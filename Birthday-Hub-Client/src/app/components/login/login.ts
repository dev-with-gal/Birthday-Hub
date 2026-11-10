import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);

  submit(): void {
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (session) => {
          this.auth.startSession(session);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const safeReturnUrl =
            returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
              ? returnUrl
              : '/';
          void this.router.navigateByUrl(safeReturnUrl);
        },
        error: (error: { status?: number }) => {
          this.errorMessage.set(
            error.status === 401
              ? 'כתובת האימייל או הסיסמה שגויים'
              : 'לא ניתן להתחבר כרגע. נסו שוב מאוחר יותר',
          );
        },
      });
  }
}
