import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UsersApiService } from '../../services/users-api.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-signup',
  styleUrl: './signup.scss',
  templateUrl: './signup.html',
})
export class Signup {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usersApi = inject(UsersApiService);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly isSubmitting = signal(false);

  submit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.errorMessage.set('הסיסמאות אינן תואמות');
      return;
    }

    this.isSubmitting.set(true);
    this.usersApi
      .create({ email, password })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('החשבון נוצר בהצלחה');
          this.form.reset();
        },
        error: (error: { status?: number }) => {
          this.errorMessage.set(
            error.status === 409
              ? 'כבר קיים חשבון עם כתובת האימייל הזו'
              : 'לא ניתן ליצור חשבון כרגע. נסו שוב מאוחר יותר',
          );
        },
      });
  }
}
