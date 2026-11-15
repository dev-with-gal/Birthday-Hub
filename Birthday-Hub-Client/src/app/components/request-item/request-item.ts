import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { he } from '../../i18n/he';
import { ApplicationReviewStatus, ApplicationStatus } from '../../types/application.types';

export type RequestItemStatus = ApplicationStatus | ApplicationReviewStatus;

export interface RequestItemData {
  id: string;
  applicationNumber: number;
  firstName: string;
  lastName: string;
  department: string;
  birthday: string;
  status: RequestItemStatus;
}

@Component({
  selector: 'app-request-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-item.html',
  styleUrls: ['./request-item.scss'],
})
export class RequestItem {
  readonly text = he;
  @Input() request!: RequestItemData;
  @Input() canReview = false;
  @Input() isUpdating = false;
  @Output() approved = new EventEmitter<string>();
  @Output() rejected = new EventEmitter<string>();
}
