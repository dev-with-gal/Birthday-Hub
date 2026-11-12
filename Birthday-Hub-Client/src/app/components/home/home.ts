import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BirthdayCard } from '../../components/birthday-card/birthday-card';
import { Employee } from '../../models/employee';
import { KeyValuePipe } from '@angular/common';
import { NewRequest } from '../new-request/new-request';
import { ApplicationsApiService } from '../../services/applications-api.service';
import { finalize } from 'rxjs';
import { he } from '../../i18n/he';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BirthdayCard, KeyValuePipe, NewRequest],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  readonly text = he;
  private readonly applicationsApi = inject(ApplicationsApiService);

  readonly employees = signal<Employee[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.applicationsApi
      .findApproved()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (applications) =>
          this.employees.set(
            applications.map((application) => ({
              id: application.id,
              name: `${application.firstName} ${application.lastName}`,
              birthday: application.birthday,
              department: application.department.name,
              avatar: null,
            })),
          ),
        error: () => this.errorMessage.set(this.text.home.loadError),
      });
  }

  groupedEmployees = computed(() => {
    return this.employees().reduce(
      (groups, employee) => {
        const department = employee.department;

        if (!groups[department]) {
          groups[department] = [];
        }

        groups[department].push(employee);

        return groups;
      },
      {} as Record<string, Employee[]>,
    );
  });
}
