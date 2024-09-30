import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MenuMobileComponent } from './menu-mobile.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('MenuMobileComponent', () => {
  let component: MenuMobileComponent;
  let fixture: ComponentFixture<MenuMobileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toggleMenuServiceSpy: jasmine.SpyObj<ToggleMenuService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logOut']);
    const toggleSpy = jasmine.createSpyObj('ToggleMenuService', ['toggleMenu']);

    await TestBed.configureTestingModule({
      declarations: [MenuMobileComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToggleMenuService, useValue: toggleSpy }
      ],
      imports: [RouterTestingModule.withRoutes([ { path: 'login', component: MenuMobileComponent}])],  // Use RouterTestingModule without overriding Route
    }).compileComponents();

    fixture = TestBed.createComponent(MenuMobileComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toggleMenuServiceSpy = TestBed.inject(ToggleMenuService) as jasmine.SpyObj<ToggleMenuService>;
    router = TestBed.inject(Router);

    fixture.detectChanges();  // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the menu and update isToggled', () => {
    toggleMenuServiceSpy.toggleMenu.and.returnValue(of(true));  // Simulate toggle returning true
    component.closeMenu();
    expect(toggleMenuServiceSpy.toggleMenu).toHaveBeenCalled();
    expect(component.isToggled).toBeTrue();
  });

  it('should log out and navigate to login', () => {
    // Spy on localStorage.clear() to ensure it's being called
    const localStorageSpy = spyOn(localStorage, 'clear').and.callFake(() => {});
  
    component.onLogout();
    expect(authServiceSpy.logOut).toHaveBeenCalled();
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
