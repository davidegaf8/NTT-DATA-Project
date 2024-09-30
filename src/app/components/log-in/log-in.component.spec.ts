import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LogInComponent } from './log-in.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let mockRouter: Router;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logIn']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        RouterTestingModule.withRoutes([ { path: 'home', component: LogInComponent}]),  // Make sure RouterTestingModule is properly configured.
      ],
      declarations: [LogInComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests after each test
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.logInForm).toBeDefined();
    expect(component.logInForm.get('token')).toBeDefined();
  });

  it('should navigate to home on valid token', () => {
    const token = 'valid-token';
    component.logInForm.setValue({ token });

    component.onSubmit();

    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toBe('GET');
    req.flush({}); // Simulate a successful response

    expect(mockAuthService.logIn).toHaveBeenCalledWith(token);
  });

  it('should show alert on invalid token', () => {
    spyOn(window, 'alert'); // Mock window.alert

    component.logInForm.setValue({ token: 'invalid-token' });

    component.onSubmit();

    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toBe('GET');
    req.flush({}, { status: 401, statusText: 'Unauthorized' }); // Simulate an error response

    expect(window.alert).toHaveBeenCalledWith('Invalid token. Please try again.');
  });

  it('should show alert if form is invalid', () => {
    spyOn(window, 'alert'); // Mock window.alert

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      'The form was not completed correctly. Please check the fields marked in red and resolve the errors before submitting the form.'
    );
  });
});
