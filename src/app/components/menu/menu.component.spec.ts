import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { MenuComponent } from './menu.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service';
import { of } from 'rxjs';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toggleMenuServiceSpy: jasmine.SpyObj<ToggleMenuService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logOut']);
    const toggleSpy = jasmine.createSpyObj('ToggleMenuService', ['toggleMenu']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [RouterTestingModule],  // Use RouterTestingModule here
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToggleMenuService, useValue: toggleSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toggleMenuServiceSpy = TestBed.inject(ToggleMenuService) as jasmine.SpyObj<ToggleMenuService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isMobile based on window width', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    component.ngOnInit();
    expect(component.isMobile).toBeTrue();

    spyOnProperty(window, 'innerWidth').and.returnValue(900);
    component.checkWindowWidth();
    expect(component.isMobile).toBeFalse();
  });

  it('should toggle menu state on calling onToggleMenu', () => {
    toggleMenuServiceSpy.toggleMenu.and.returnValue(of(true)); // Simulate toggle returning true
    component.onToggleMenu();
    expect(toggleMenuServiceSpy.toggleMenu).toHaveBeenCalled();
    expect(component.isToggled).toBeTrue();
  });

  it('should log out and navigate to login', () => {
    component.onLogout();
    expect(authServiceSpy.logOut).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
    spyOn(localStorage, 'clear'); // Add spy to handle localStorage.clear() mock
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
