import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApplicationsApiService } from '../../services/applications-api.service';
import { MiniGame } from './mini-game';

describe('MiniGame', () => {
  let component: MiniGame;
  let fixture: ComponentFixture<MiniGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniGame],
      providers: [
        {
          provide: ApplicationsApiService,
          useValue: { findApproved: () => of([]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
