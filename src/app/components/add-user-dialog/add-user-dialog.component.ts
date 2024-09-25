import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent {
  addUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      const newUser = {
        ...this.addUserForm.value,
        id: this.generateRandomId(),
        status: this.generateRandomStatus()
      };
      this.dialogRef.close(newUser);
    }
  }

  generateRandomId(): number {
    return Math.floor(Math.random() * 10000);
  }

  generateRandomStatus(): string {
    return Math.random() > 0.5 ? 'active' : 'inactive';
  }
}
