import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { NewRequest } from '../new-request/new-request';
import { ApplicationsApiService } from '../../services/applications-api.service';
import { ApplicationResponse, ApplicationStatus } from '../../types/application.types';
import { he } from '../../i18n/he';

@Component({
  imports: [CommonModule, NewRequest],
  selector: 'app-my-requests',
  styleUrl: './my-requests.scss',
  templateUrl: './my-requests.html',
})
export class MyRequests implements OnInit {
  readonly text = he;
  readonly ApplicationStatus = ApplicationStatus;
  private readonly applicationsApi = inject(ApplicationsApiService);

  readonly applications = signal<ApplicationResponse[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.applicationsApi
      .findMine()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (applications) => this.applications.set(applications),
        error: () => this.errorMessage.set(this.text.applications.loadError),
      });
  }
}
