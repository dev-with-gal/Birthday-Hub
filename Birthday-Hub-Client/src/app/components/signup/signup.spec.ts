import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Signup } from './signup';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays email and password requirements when the form is invalid', () => {
    component.form.setValue({
      email: 'not-an-email',
      password: 'short',
      confirmPassword: 'short',
    });
    component.submit();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.signup__field-error')?.textContent).toContain(
      component.text.signup.invalidEmail,
    );
    expect(element.querySelectorAll('.signup__field-error')[1].textContent).toContain(
      component.text.signup.invalidPassword,
    );
    httpTestingController.expectNone(`${environment.apiUrl}/users`);
  });
});
