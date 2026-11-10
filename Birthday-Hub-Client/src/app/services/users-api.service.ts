import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface CreatedUserResponse {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = 'http://localhost:3000/users';

  create(request: CreateUserRequest): Observable<CreatedUserResponse> {
    return this.http.post<CreatedUserResponse>(this.usersUrl, request);
  }
}
