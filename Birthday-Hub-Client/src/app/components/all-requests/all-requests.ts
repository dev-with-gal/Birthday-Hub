import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  ApplicationReviewStatus,
  ApplicationsApiService,
} from '../../services/applications-api.service';
import { RequestItemData } from '../request-item/request-item';
import { Requests } from '../requests/requests';
import { NewRequest } from '../new-request/new-request';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [Requests, NewRequest],
  templateUrl: './all-requests.html',
  styleUrl: './all-requests.scss',
})
export class AllRequests implements OnInit {
  private readonly applicationsApi = inject(ApplicationsApiService);
  private readonly auth = inject(AuthService);

  readonly applications = signal<RequestItemData[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly updatingId = signal<string | null>(null);
  readonly canReview = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === 'COORDINATOR' || role === 'HR_MANAGER';
  });

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.applicationsApi
      .findAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (applications) =>
          this.applications.set(
            applications.map((application) => ({
              id: application.id,
              applicationNumber: application.applicationNumber,
              firstName: application.firstName,
              lastName: application.lastName,
              department: application.department.name,
              birthday: application.birthday,
              status: application.status,
            })),
          ),
        error: () => this.errorMessage.set('לא ניתן לטעון את הבקשות כרגע'),
      });
  }

  review(id: string, status: ApplicationReviewStatus): void {
    if (!this.canReview() || this.updatingId()) return;

    this.errorMessage.set('');
    this.updatingId.set(id);
    this.applicationsApi
      .review(id, status)
      .pipe(finalize(() => this.updatingId.set(null)))
      .subscribe({
        next: () =>
          this.applications.update((applications) =>
            applications.map((application) =>
              application.id === id ? { ...application, status } : application,
            ),
          ),
        error: () => this.errorMessage.set('לא ניתן לעדכן את סטטוס הבקשה'),
      });
  }
}
