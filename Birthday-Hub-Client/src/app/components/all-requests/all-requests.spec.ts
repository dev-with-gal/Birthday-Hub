import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ApplicationsApiService } from '../../services/applications-api.service';
import { AllRequests } from './all-requests';

describe('AllRequests', () => {
  let component: AllRequests;
  let fixture: ComponentFixture<AllRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRequests],
      providers: [
        {
          provide: ApplicationsApiService,
          useValue: { findAll: () => of([]), review: () => of({}) },
        },
        {
          provide: AuthService,
          useValue: {
            authenticated: signal(true),
            currentUser: signal({ role: 'EMPLOYEE' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AllRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
