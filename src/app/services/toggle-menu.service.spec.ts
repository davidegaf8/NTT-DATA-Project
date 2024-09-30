import { TestBed } from '@angular/core/testing';
import { ToggleMenuService } from './toggle-menu.service'; // Update the import path as necessary

describe('ToggleMenuService', () => {
  let service: ToggleMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new ToggleMenuService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isToggled as false', () => {
    expect(service.isToggled).toBeFalse();  // Initially, the menu should not be toggled
  });

  it('should toggle isToggled state and emit the correct value', (done: DoneFn) => {
    // Subscribe to the toggle observable
    service.toggleMenu().subscribe((isToggled) => {
      // Expect the state to be true after the first toggle
      expect(isToggled).toBeFalse();
      done();  // Mark the test as done when we get the expected result
    });

    // Call toggleMenu to change the state
    service.toggleMenu();
  });

  it('should toggle the state back and forth correctly', (done: DoneFn) => {
    let callCount = 0;
  
    // Subscribe once to the toggle observable
    const toggle$ = service.toggleMenu();
  
    toggle$.subscribe((isToggled) => {
      callCount++;
  
      if (callCount === 1) {
        expect(isToggled).toBeFalse(); // First toggle
        service.toggleMenu(); // Call toggleMenu again
      } else if (callCount === 2) {
        expect(isToggled).toBeTrue(); // Second toggle
        done(); // Complete test
      }
    });
  
    // First toggle
    service.toggleMenu();
  });
  
});