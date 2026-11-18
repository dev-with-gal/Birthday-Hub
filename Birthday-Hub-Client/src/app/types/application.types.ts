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

interface ApplicationResponseBase {
  id: string;
  applicationNumber: number;
  firstName: string;
  lastName: string;
  birthday: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface CreatedApplicationResponse extends ApplicationResponseBase {
  departmentId: string;
}

export interface ApplicationResponse extends ApplicationResponseBase {
  department: { name: string };
}
