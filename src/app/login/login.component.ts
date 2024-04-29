import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  @Output() loginSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:3000/login', { email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log(response);
          // emit login success event
          this.loginSuccess.emit(true);
          // navigate to home page route
          this.router.navigate(['/home']);
        },
        error: (error) => {
          // handle login error
          this.error = error.error.message;
        }
      });
  }
}