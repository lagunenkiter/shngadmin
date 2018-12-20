
import { Injectable } from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(protected router: Router, protected authService: AuthService) { }

  canActivate(rout, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) { return true; }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

