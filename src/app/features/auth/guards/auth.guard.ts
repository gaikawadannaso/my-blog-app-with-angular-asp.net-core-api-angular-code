import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode  } from 'jwt-decode';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();
  const messageService = inject(MessageService)

  let token = cookieService.get('Authorization');

  if(token && user){
    token = token.replace('Bearer ','');
   const decodeToken : any = jwtDecode (token);

   const expDate = decodeToken.exp * 1000;
   const currentTime = new Date().getTime();

   if(expDate < currentTime){
    authService.logout();
    messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Token Expired'
    });
    return router.createUrlTree(['/login'], {queryParams : {returnUrl : state.url}})
    
   }
   else{
    if(user.roles.includes('Writer')){
      return true;
    }else{

      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unauthorized'
      });

      return false;
    }
   }
  }
  else{
    authService.logout();
    return router.createUrlTree(['/login'], {queryParams : {returnUrl : state.url}});
  }

};
