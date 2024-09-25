import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const tokenKey = 'authToken';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store the token in localStorage when logIn is called', () => {
    const token = '123456';
    service.logIn(token);
    expect(localStorage.getItem(tokenKey)).toBe(token);
  });

  it('should remove the token from localStorage when logOut is called', () => {
    service.logIn('123456');
    service.logOut();
    expect(localStorage.getItem(tokenKey)).toBeNull();
  });

  it('should return true if a token exists in localStorage', () => {
    service.logIn('123456');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if no token exists in localStorage', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return the token if it exists in localStorage', () => {
    const token = '123456';
    service.logIn(token);
    expect(service.getToken()).toBe(token);
  });

  it('should return null if no token exists in localStorage', () => {
    expect(service.getToken()).toBeNull();
  });
});
