import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApplicationsApiService } from '../../services/applications-api.service';
import { AuthService } from '../../services/auth.service';

export const DEPARTMENTS = ['הנדסה', 'שיווק', 'עיצוב', 'מכירות', 'משאבי אנוש'];

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-request.html',
  styleUrls: ['./new-request.scss'],
})
export class NewRequest {
  @Output() applicationCreated = new EventEmitter<void>();

  private readonly applicationsApi = inject(ApplicationsApiService);
  readonly auth = inject(AuthService);

  readonly isOpen = signal(false);
  firstName = '';
  lastName = '';
  department = '';
  birthdate = '';
  image: File | null = null;
  imagePreview: string | null = null;
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly isSubmitting = signal(false);

  departments = DEPARTMENTS;

  openModal(): void {
    this.errorMessage.set('');
    this.isOpen.set(true);
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      this.image = null;
      this.imagePreview = null;
      return;
    }

    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }

  submitRequest(): void {
    if (
      !this.auth.isLoggedIn() ||
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.department ||
      !this.birthdate ||
      this.isSubmitting()
    ) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);
    this.applicationsApi
      .create({
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim(),
        department: this.department,
        birthday: this.birthdate,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('הבקשה נוצרה בהצלחה');
          this.applicationCreated.emit();
          this.firstName = '';
          this.lastName = '';
          this.department = '';
          this.birthdate = '';
          this.image = null;
          this.imagePreview = null;
          this.closeModal();
        },
        error: (error: { status?: number }) => {
          this.errorMessage.set(
            error.status === 401
              ? 'יש להתחבר כדי ליצור בקשה'
              : 'לא ניתן ליצור את הבקשה כרגע. נסו שוב מאוחר יותר',
          );
        },
      });
  }
}
