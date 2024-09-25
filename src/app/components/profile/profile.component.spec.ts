import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from './profile.component';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: () => of({ name: 'New Name', surname: 'New Surname', email: 'new@user.com', gender: 'Female' }),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user data from localStorage on init', () => {
    const user = {
      id: 1234567,
      name: 'Stored User',
      surname: 'User',
      email: 'stored@user.com',
      gender: 'Male',
      status: 'active',
    };
    localStorage.setItem('user', JSON.stringify(user));
    component.ngOnInit();
    expect(component.user).toEqual(user);
  });

  it('should update image source based on gender', () => {
    component.user.gender = 'Female';
    component.updateImageSrc();
    expect(component.imageSrc).toContain('Female avatar.png');

    component.user.gender = 'Male';
    component.updateImageSrc();
    expect(component.imageSrc).toContain('Male avatar.png');
  });

  it('should handle file selection and update image', () => {
    const file = new Blob([''], { type: 'image/png' });
    const fileInput = new FileReader();

    spyOn(fileInput, 'readAsDataURL').and.callFake((file) => {
      component.imageSrc = URL.createObjectURL(file);
    });

    const event = { target: { files: [file] } };
    component.onFileSelected(event);
    expect(component.imageSrc).toContain('blob:');
  });

  it('should open edit dialog and update user data', () => {
    component.openEditDialog();
    expect(component.user.name).toBe('New Name');
    expect(component.user.surname).toBe('New Surname');
    expect(component.user.email).toBe('new@user.com');
    expect(component.user.gender).toBe('Female');
  });

  it('should save user data to localStorage', () => {
    const user = {
      id: 1234567,
      name: 'Current User',
      surname: 'User',
      email: 'current@user.com',
      gender: 'N/A',
      status: 'active',
    };
    component.user = user;
    component.saveUserData();
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(user));
  });

  it('should initialize image source correctly', () => {
    component.updateImageSrc();
    expect(component.imageSrc).toContain('Male avatar.png');
  });

  it('should handle empty user image in localStorage', () => {
    localStorage.setItem('user', JSON.stringify(component.user));
    component.updateImageSrc();
    expect(component.imageSrc).toContain('Male avatar.png');
  });

  afterEach(() => {
    localStorage.clear();
  });
});