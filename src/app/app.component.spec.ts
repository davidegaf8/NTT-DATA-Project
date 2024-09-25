import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { AppComponent } from './app.component';
import { ToggleMenuService } from './services/toggle-menu.service';
import { AuthService } from './auth/auth.service';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockToggleMenuService: jasmine.SpyObj<ToggleMenuService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: any; // Usa 'any' per il mock del Router
  let eventsSubject: Subject<any>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Add this line
      imports: [/* other imports */],
    }).compileComponents();
  });

  beforeEach(async () => {
    mockToggleMenuService = jasmine.createSpyObj('ToggleMenuService', ['toggleMenu']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logIn', 'logOut']);
    eventsSubject = new Subject();

    // Creiamo un mock per il Router
    mockRouter = {
      events: eventsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: ToggleMenuService, useValue: mockToggleMenuService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    mockToggleMenuService.toggleMenu.and.returnValue(of(false)); // Valore iniziale per stato toggled
    fixture.detectChanges(); // Inizializza il componente
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to toggleMenu service on init', () => {
    component.ngOnInit();
    expect(mockToggleMenuService.toggleMenu).toHaveBeenCalled();
  });

  it('should update isToggled based on the toggleMenu service', () => {
    component.ngOnInit();
    expect(component.isToggled).toBeFalse(); // Stato iniziale
    mockToggleMenuService.toggleMenu.and.returnValue(of(true)); // Cambia a true
    component.ngOnInit(); // Ri-inizializza per attivare la subscription
    expect(component.isToggled).toBeTrue();
  });

  it('should handle navigation events and set isUsersComponent correctly', () => {
    component.ngOnInit();
    expect(component.isUsersComponent).toBeFalse();

    // Emuliamo un evento di navigazione
    eventsSubject.next(new NavigationEnd(1, '/users', '/users'));
    expect(component.isUsersComponent).toBeTrue(); // Verifica se il percorso del componente è rilevato
  });

  it('should scroll to the top on navigation', () => {
    spyOn(window, 'scrollTo'); // Mock di window.scrollTo
    component.ngOnInit();
    
    // Attiviamo un evento di navigazione
    eventsSubject.next(new NavigationEnd(1, '/', '/'));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0); // Verifica comportamento di scroll
  });
});
