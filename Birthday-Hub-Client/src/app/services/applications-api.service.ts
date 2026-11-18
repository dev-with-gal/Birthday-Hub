import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApplicationResponse,
  ApplicationReviewStatus,
  CreatedApplicationResponse,
  CreateApplicationRequest,
} from '../types/application.types';

@Injectable({ providedIn: 'root' })
export class ApplicationsApiService {
  private readonly http = inject(HttpClient);
  private readonly applicationsUrl = `${environment.apiUrl}/applications`;

  create(request: CreateApplicationRequest): Observable<CreatedApplicationResponse> {
    return this.http.post<CreatedApplicationResponse>(this.applicationsUrl, request);
  }

  findAll(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(this.applicationsUrl);
  }

  findMine(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(`${this.applicationsUrl}/mine`);
  }

  findApproved(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(`${this.applicationsUrl}/approved`);
  }

  review(id: string, status: ApplicationReviewStatus): Observable<unknown> {
    return this.http.patch(`${this.applicationsUrl}/${id}/status`, { status });
  }
}
