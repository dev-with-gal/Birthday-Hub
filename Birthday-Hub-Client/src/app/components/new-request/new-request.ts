import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface NewRequestData {
  name: string;
  department: string;
  birthdate: string;
  image: File | null;
}

export const DEPARTMENTS = [
  'הנדסה',
  'שיווק',
  'עיצוב',
  'מכירות',
  'משאבי אנוש',
];

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-request.html',
  styleUrls: ['./new-request.scss'],
})
export class NewRequest {
  @Output() requestCreated = new EventEmitter<NewRequestData>();

  isOpen = false;
  name = '';
  department = '';
  birthdate = '';
  image: File | null = null;
  imagePreview: string | null = null;

  departments = DEPARTMENTS;

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
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
    this.requestCreated.emit({
      name: this.name.trim(),
      department: this.department.trim(),
      birthdate: this.birthdate,
      image: this.image,
    });

    this.name = '';
    this.department = '';
    this.birthdate = '';
    this.image = null;
    this.imagePreview = null;
    this.closeModal();
  }
}
