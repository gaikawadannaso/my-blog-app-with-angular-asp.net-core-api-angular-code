import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  model : LoginRequest;

  constructor(private authService : AuthService, private messageService : MessageService,
    private cookieService : CookieService, private router : Router){
    this.model = {
      email : '',
      password : ''
    }
  }

  onFormSubmit() : void{
    
    this.authService.login(this.model)
    .subscribe({
      
      next: (response) => {
        this.cookieService.set('Authorization',`Bearer ${response.token}`,
          undefined,'/',undefined,true,'Strict'
        );

        this.authService.setUser({
          email : response.email,
          roles : response.roles
        });

        this.messageService.add({
          severity: 'success',
          summary: 'Login',
          detail: 'Login successfully'
        });
        console.log(response)
        //this.router.navigateByUrl('/admin/categories');
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to login'
        });
      }

    });

  }


}
