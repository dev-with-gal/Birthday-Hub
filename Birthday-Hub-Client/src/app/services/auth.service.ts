import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'birthday-hub.access-token';
  private readonly expirationKey = 'birthday-hub.access-token-expiration';

  readonly authenticated = signal(this.hasValidSession());

  get accessToken(): string | null {
    return this.isLoggedIn() ? sessionStorage.getItem(this.tokenKey) : null;
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:3000/auth/login',
      credentials,
    );
  }

  startSession(response: LoginResponse): void {
    sessionStorage.setItem(this.tokenKey, response.accessToken);
    sessionStorage.setItem(
      this.expirationKey,
      String(Date.now() + response.expiresIn * 1000),
    );
    this.authenticated.set(true);
  }

  isLoggedIn(): boolean {
    const valid = this.hasValidSession();
    if (this.authenticated() !== valid) {
      this.authenticated.set(valid);
    }
    return valid;
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.expirationKey);
    this.authenticated.set(false);
    void this.router.navigateByUrl('/login');
  }

  private hasValidSession(): boolean {
    if (typeof sessionStorage === 'undefined') {
      return false;
    }

    const token = sessionStorage.getItem(this.tokenKey);
    const expiresAt = Number(sessionStorage.getItem(this.expirationKey));
    if (!token || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.expirationKey);
      return false;
    }
    return true;
  }
}