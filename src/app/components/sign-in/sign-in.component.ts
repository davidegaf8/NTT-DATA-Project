import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
    hide = true;
    signInForm!: FormGroup;
    isFormValid: boolean = true;

    constructor(private route: Router, private http: HttpClient, private authService: AuthService) {}
      
    ngOnInit(): void {
      this.signInForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        gender: new FormControl(''),
        token: new FormControl('', [Validators.required]),
      });
    }

    onSubmit() {
      if (this.signInForm.valid) {
        this.isFormValid = true;

        // Validate the token by making a request to an API endpoint that requires the token.
        const token = this.signInForm.get('token')?.value;

        // Example validation (replace with actual API call)
        this.http.get('https://gorest.co.in/public/v2/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).subscribe(
          (response) => {
            const userData = {
              name: this.signInForm.get('name')?.value,
              surname: this.signInForm.get('surname')?.value,
              email: this.signInForm.get('email')?.value,
              gender: this.signInForm.get('gender')?.value,
              status: 'active',
              token: token // Store the token
            };
            localStorage.setItem('user', JSON.stringify(userData));
            this.signInForm.reset();
            this.authService.logIn(token);
            this.route.navigate(['home']);  // Navigate to profile page after sign-in
          },
          (error) => {
            alert('Invalid token. Please provide a valid token.');
          }
        );

      } else {
        this.isFormValid = false;
      }
    }
}
