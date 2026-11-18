import type { ReviewApplicationStatus } from './dto/review-application.dto.js';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface CreateApplicationData {
  firstName: string;
  lastName: string;
  birthday: Date;
  departmentId: string;
  submittedById: string;
}

export interface ReviewApplicationData {
  status: ReviewApplicationStatus;
  reviewedAt: Date;
  approvedById: string | null;
}
