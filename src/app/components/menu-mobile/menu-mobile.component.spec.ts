import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MenuMobileComponent } from './menu-mobile.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service';
import { of } from 'rxjs';

describe('MenuMobileComponent', () => {
  let component: MenuMobileComponent;
  let fixture: ComponentFixture<MenuMobileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toggleMenuServiceSpy: jasmine.SpyObj<ToggleMenuService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logOut']);
    const toggleSpy = jasmine.createSpyObj('ToggleMenuService', ['toggleMenu']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [MenuMobileComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToggleMenuService, useValue: toggleSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuMobileComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toggleMenuServiceSpy = TestBed.inject(ToggleMenuService) as jasmine.SpyObj<ToggleMenuService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the menu and update isToggled', () => {
    toggleMenuServiceSpy.toggleMenu.and.returnValue(of(true)); // Simulate toggle returning true
    component.closeMenu();
    expect(toggleMenuServiceSpy.toggleMenu).toHaveBeenCalled();
    expect(component.isToggled).toBeTrue();
  });

  it('should log out and navigate to login', () => {
    component.onLogout();
    expect(authServiceSpy.logOut).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
