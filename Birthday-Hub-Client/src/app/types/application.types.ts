export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ApplicationReviewStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface CreateApplicationRequest {
  firstName: string;
  lastName: string;
  birthday: string;
  department: string;
}

export interface CreatedApplicationResponse {
  id: string;
  applicationNumber: number;
  firstName: string;
  lastName: string;
  birthday: string;
  departmentId: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface ApplicationResponse {
  id: string;
  applicationNumber: number;
  firstName: string;
  lastName: string;
  birthday: string;
  status: ApplicationStatus;
  createdAt: string;
  department: { name: string };
}
