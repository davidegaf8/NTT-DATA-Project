import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MenuComponent } from '../menu/menu.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service'; // Adjust the import path if needed

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    const toggleMenuServiceMock = {
      // Mock any necessary methods here if needed
    };

    TestBed.configureTestingModule({
      declarations: [HeaderComponent, MenuComponent],
      providers: [
        { provide: ToggleMenuService, useValue: toggleMenuServiceMock } // Mock the service
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
