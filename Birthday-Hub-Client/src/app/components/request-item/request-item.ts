import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface RequestItemData {
  id: string;
  applicationNumber: number;
  firstName: string;
  lastName: string;
  department: string;
  birthday: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

@Component({
  selector: 'app-request-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-item.html',
  styleUrls: ['./request-item.scss'],
})
export class RequestItem {
  @Input() request!: RequestItemData;
  @Input() canReview = false;
  @Input() isUpdating = false;
  @Output() approved = new EventEmitter<string>();
  @Output() rejected = new EventEmitter<string>();
}
