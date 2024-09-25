import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user.model';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: 1234567,
    name: "Current",
    surname: "User",
    email: "current@user.com",
    gender: "N/A",
    status: "active"
  };

  imageSrc: string = './../../../assets/img/Male avatar.png'; // Default image

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.updateImageSrc();
    } else {
      this.updateImageSrc(); // Ensure the default image is set based on gender
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.imageSrc = reader.result as string;
        localStorage.setItem('userImage', this.imageSrc); // Save the image in localStorage
      };
      reader.readAsDataURL(file);
    }
  }

  onChangeImage(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '250px',
      data: { ...this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user = { ...result };
        this.saveUserData();
        this.updateImageSrc();
      }
    });
  }

  public saveUserData(): void {
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  public updateImageSrc(): void {
    this.imageSrc = this.user.gender === 'Female'
      ? './../../../assets/img/Female avatar.png'
      : './../../../assets/img/Male avatar.png';

    const storedImage = localStorage.getItem('userImage');
    if (storedImage) {
      this.imageSrc = storedImage;
    }
  }
}
