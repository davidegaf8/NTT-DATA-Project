import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EditUserDialogComponent } from './edit-user-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

describe('EditUserDialogComponent', () => {
  let component: EditUserDialogComponent;
  let fixture: ComponentFixture<EditUserDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditUserDialogComponent, any>>;

  const mockDialogData = {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    gender: 'male',
  };

  beforeEach(async () => {
    // Create a spy for MatDialogRef
    const dialogSpy = jasmine.createSpyObj<MatDialogRef<EditUserDialogComponent, any>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [EditUserDialogComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,  
        MatInputModule,      
        MatButtonModule,     
        NoopAnimationsModule,
        MatSelectModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserDialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<EditUserDialogComponent, any>>;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the provided dialog data', () => {
    expect(component.editUserForm.value).toEqual({
      name: mockDialogData.name,
      surname: mockDialogData.surname,
      email: mockDialogData.email,
      gender: mockDialogData.gender
    });
  });

  it('should validate form fields correctly', () => {
    const form = component.editUserForm;
    
    // Test required name field
    form.controls['name'].setValue('');
    expect(form.controls['name'].valid).toBeFalsy();
    form.controls['name'].setValue('John');
    expect(form.controls['name'].valid).toBeTruthy();

    // Test required email and valid email format
    form.controls['email'].setValue('');
    expect(form.controls['email'].valid).toBeFalsy();
    form.controls['email'].setValue('invalid-email');
    expect(form.controls['email'].valid).toBeFalsy();
    form.controls['email'].setValue('john.doe@example.com');
    expect(form.controls['email'].valid).toBeTruthy();
  });

  it('should close the dialog with the updated user data when onSave is called', () => {
    const formValue = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      gender: 'male'
    };

    component.editUserForm.setValue(formValue);
    component.onSave();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(formValue);
  });

  it('should close the dialog without returning data when onCancel is called', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('should reset the form when onReset is called', () => {
    component.editUserForm.setValue({
      name: 'Jane',
      surname: 'Smith',
      email: 'jane.smith@example.com',
      gender: 'female',
    });
    component.onReset();
    expect(component.editUserForm.value).toEqual({
      name: null,
      surname: null,
      email: null,
      gender: null,
    });
  });
});
