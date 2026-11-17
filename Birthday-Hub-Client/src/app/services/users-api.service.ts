import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateUserRequest, CreatedUserResponse } from '../types/user.types';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${environment.apiUrl}/users`;

  create(request: CreateUserRequest): Observable<CreatedUserResponse> {
    return this.http.post<CreatedUserResponse>(this.usersUrl, request);
  }
}
