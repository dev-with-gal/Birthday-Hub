import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class ApplicationsApiService {
  private readonly http = inject(HttpClient);
  private readonly applicationsUrl = 'http://localhost:3000/applications';

  create(request: CreateApplicationRequest): Observable<CreatedApplicationResponse> {
    return this.http.post<CreatedApplicationResponse>(this.applicationsUrl, request);
  }

  findAll(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(this.applicationsUrl);
  }

  findMine(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(`${this.applicationsUrl}/mine`);
  }

  review(id: string, status: ApplicationReviewStatus): Observable<unknown> {
    return this.http.patch(`${this.applicationsUrl}/${id}/status`, { status });
  }
}
