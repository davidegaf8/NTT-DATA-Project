import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddUserDialogComponent } from './add-user-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('AddUserDialogComponent', () => {
  let component: AddUserDialogComponent;
  let fixture: ComponentFixture<AddUserDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddUserDialogComponent>>;

  beforeEach(async () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      declarations: [AddUserDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserDialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddUserDialogComponent>>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.addUserForm).toBeTruthy();
    expect(component.addUserForm.controls['name']).toBeTruthy();
    expect(component.addUserForm.controls['surname']).toBeTruthy();
    expect(component.addUserForm.controls['email']).toBeTruthy();
  });

  it('should close the dialog with user data on submit if the form is valid', () => {
    component.addUserForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
    });

    component.onSubmit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
    }));
  });

  it('should not close the dialog with user data on submit if the form is invalid', () => {
    component.addUserForm.setValue({
      name: '',
      surname: 'Doe',
      email: 'john.doe@example.com',
    });

    component.onSubmit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close the dialog without data on cancel', () => {
    component.onCancel();

    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('should generate a random ID', () => {
    const id = component.generateRandomId();
    expect(id).toBeGreaterThanOrEqual(0);
    expect(id).toBeLessThan(10000);
  });

  it('should generate a random status', () => {
    const status = component.generateRandomStatus();
    expect(['active', 'inactive']).toContain(status);
  });
});

