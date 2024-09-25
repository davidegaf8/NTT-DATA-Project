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
      expect(isToggled).toBeTrue();
      done();  // Mark the test as done when we get the expected result
    });

    // Call toggleMenu to change the state
    service.toggleMenu();
  });

  it('should toggle the state back and forth correctly', (done: DoneFn) => {
    let callCount = 0;

    // Subscribe to the toggle observable
    service.toggleMenu().subscribe((isToggled) => {
      callCount++;

      // Check the state after each call to toggleMenu
      if (callCount === 1) {
        expect(isToggled).toBeTrue(); // First toggle
        service.toggleMenu(); // Call toggleMenu again to change it back
      } else if (callCount === 2) {
        expect(isToggled).toBeFalse(); // Second toggle
        done(); // Finish the test after the second toggle
      }
    });

    // First call to toggleMenu to change the state to true
    service.toggleMenu();
  });
});
