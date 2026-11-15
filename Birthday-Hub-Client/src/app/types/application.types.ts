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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface ApplicationResponse {
  id: string;
  applicationNumber: number;
  firstName: string;
  lastName: string;
  birthday: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  department: { name: string };
}

export type ApplicationReviewStatus = 'APPROVED' | 'REJECTED';
