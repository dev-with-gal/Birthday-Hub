import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

export interface RequestItemData {
  name: string;
  department: string;
  birthdate: string;
  image: File | string | null;
}

@Component({
  selector: 'app-request-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-item.html',
  styleUrls: ['./request-item.scss'],
})
export class RequestItem implements OnChanges, OnDestroy {
  @Input() request!: RequestItemData;
  @Output() approved = new EventEmitter<RequestItemData>();
  @Output() rejected = new EventEmitter<RequestItemData>();

  imageSrc: string | null = null;
  private objectUrl: string | null = null;

  ngOnChanges(): void {
    this.releaseObjectUrl();
    this.imageSrc = null;

    if (typeof this.request?.image === 'string') {
      this.imageSrc = this.request.image;
    } else if (typeof File !== 'undefined' && this.request?.image instanceof File) {
      this.objectUrl = URL.createObjectURL(this.request.image);
      this.imageSrc = this.objectUrl;
    }
  }

  ngOnDestroy(): void {
    this.releaseObjectUrl();
  }

  private releaseObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
