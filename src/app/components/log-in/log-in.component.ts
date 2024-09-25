import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  logInForm!: FormGroup;

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.logInForm = new FormGroup({
      token: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.logInForm.valid) {
      const token = this.logInForm.value.token;
      this.http.get(`https://gorest.co.in/public/v2/users`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        () => {
          this.authService.logIn(token);
          this.router.navigate(['home']);
        },
        error => {
          alert('Invalid token. Please try again.');
        }
      );
    } else {
      alert('The form was not completed correctly. Please check the fields marked in red and resolve the errors before submitting the form.');
    }
  }
}
