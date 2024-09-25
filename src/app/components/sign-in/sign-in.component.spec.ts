import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { SignInComponent } from './sign-in.component';
import { AuthService } from 'src/app/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let httpTestingController: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logIn']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SignInComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges(); // Initialize the component
  });

  // This ensures localStorage.setItem is spied on before each test
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure there are no outstanding requests
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.signInForm).toBeDefined();
    expect(component.signInForm.valid).toBeFalsy(); // Initial state should be invalid
  });

  it('should mark the form as invalid when submitted with empty fields', () => {
    component.onSubmit();
    expect(component.isFormValid).toBeFalse();
  });

  it('should submit the form and navigate on valid token', () => {
    component.signInForm.setValue({
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: 'password',
      gender: 'Male',
      token: 'valid_token'
    });

    component.onSubmit();

    const req = httpTestingController.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toEqual('GET');
    req.flush([]); // Simulate a successful response

    expect(mockAuthService.logIn).toHaveBeenCalledWith('valid_token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', jasmine.any(String)); // Verifying localStorage.setItem
    expect(mockRouter.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should show an alert and not navigate on invalid token', () => {
    spyOn(window, 'alert'); // Mock window alert

    component.signInForm.setValue({
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: 'password',
      gender: 'Male',
      token: 'invalid_token'
    });

    component.onSubmit();

    const req = httpTestingController.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toEqual('GET');
    req.flush('', { status: 401, statusText: 'Unauthorized' }); // Simulate an error response

    expect(window.alert).toHaveBeenCalledWith('Invalid token. Please provide a valid token.');
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // Ensure navigation didn't happen
  });
});
