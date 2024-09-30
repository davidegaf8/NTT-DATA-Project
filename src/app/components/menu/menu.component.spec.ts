import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';  // Use RouterTestingModule for router mocking
import { Router } from '@angular/router';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toggleMenuServiceSpy: jasmine.SpyObj<ToggleMenuService>;

  beforeEach(async () => {
    // Create spies for the services
    const authSpy = jasmine.createSpyObj('AuthService', ['logOut']);
    const toggleSpy = jasmine.createSpyObj('ToggleMenuService', ['toggleMenu']);

    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [RouterTestingModule],  // Use RouterTestingModule here for routing
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToggleMenuService, useValue: toggleSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toggleMenuServiceSpy = TestBed.inject(ToggleMenuService) as jasmine.SpyObj<ToggleMenuService>;

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isMobile based on window width', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    component.ngOnInit();
    expect(component.isMobile).toBeTrue();
  });

  it('should toggle menu state on calling onToggleMenu', () => {
    toggleMenuServiceSpy.toggleMenu.and.returnValue(of(true)); // Simulate toggle returning true
    component.onToggleMenu();
    expect(toggleMenuServiceSpy.toggleMenu).toHaveBeenCalled();
    expect(component.isToggled).toBeTrue();
  });

  it('should log out and navigate to login', () => {
    // Spy on the router's navigate method
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
  
    component.onLogout();
  
    expect(authServiceSpy.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
    spyOn(localStorage, 'clear'); // Mock localStorage.clear()
  });
});
