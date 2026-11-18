import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a message when the credentials are invalid', () => {
    component.form.setValue({ email: 'user@example.com', password: 'wrong-password' });
    component.submit();

    httpTestingController
      .expectOne('http://localhost:3000/auth/login')
      .flush(
        { message: 'Invalid email or password' },
        { status: 401, statusText: 'Unauthorized' },
      );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      component.text.login.invalidCredentials,
    );
  });

  it('displays a message when the email format is invalid', () => {
    component.form.setValue({ email: 'not-an-email', password: 'password' });
    component.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      component.text.login.invalidForm,
    );
    httpTestingController.expectNone('http://localhost:3000/auth/login');
  });
});
