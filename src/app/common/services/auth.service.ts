
import { HttpClient } from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import {parse} from 'url';

import {sha512} from 'js-sha512';

import {OlddataService} from './olddata.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: any;
  helper: any;
  isLoginRequired: boolean;
  expiredLogin: boolean;

  constructor(private http: HttpClient,
              private dataService: OlddataService,
              public jwtHelper: JwtHelperService) {


    this.isLoginRequired = true;
    const token = localStorage.getItem('token');
//    if (token) {
//      const jwt = new JwtHelperService();
//      this.currentUser = jwt.decodeToken(token);
//    }
  }

  login(credentials) {
    const send_hash = 'shNG0160$';
    const hostip = this.dataService.getHostIp();

    const send_credentials = <any>{};

    send_credentials.username = '';
    if (credentials.username !== '') {
      send_credentials.username = sha512(credentials.username+send_hash);
    }

    send_credentials.password = '';
    if (credentials.password !== '') {
      send_credentials.password = sha512(sha512(credentials.password) + send_hash);
    }

    if (hostip === 'localhost') {
      if (credentials.username === '') { return of(false); }

      // After login:
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQXV0b2xvZ2luIiwiYWRtaW4iOnRydWUsImV4cCI6MTU0NjIzOTAyMiwiaWF0IjoxNTE2MjM5MDIyfQ.GpSSzk5SicKgGttwiVFq5xdOK7SM8KHU9992RBDUETU');

      this.currentUser = this.jwtHelper.decodeToken(localStorage.getItem('token'));
      const decodedToken = this.currentUser;
      console.log('authService.login', {decodedToken});

      // if login succeeds with an empty username, no login is required
      this.isLoginRequired = !(credentials.username === '');

      return of(true);
    }

    // if not in develop environment:
    // return this.http.post('http://smarthomeng.fritz.box:1234/api/authenticate/user', JSON.stringify(send_credentials))
    // const apiUrl = sessionStorage.getItem('apiUrl');
    const apiUrl = '/api/';
    console.log('login', apiUrl + 'authenticate/user');
    console.log({send_credentials});
    return this.http.post(apiUrl + 'authenticate/user', JSON.stringify(send_credentials))
      .pipe(map(response => {
        const result = <any>response;

        if (result && result.token) {
          localStorage.setItem('token', result.token);

          const jwt = new JwtHelperService();
          // this.currentUser = jwt.decodeToken(localStorage.getItem('token'));
          this.currentUser = this.jwtHelper.decodeToken(localStorage.getItem('token'));

          // if login succeeds with an empty username, no login is required
          this.isLoginRequired = !(credentials.username === '');

          console.log('login', 'success');
          return true;
        } else {
          console.log('login', 'fail');
          return false;
        }
      }));
  }


  login2(credentials) {
    return this.http.post('/api/authenticate', JSON.stringify(credentials))
      .pipe(map(response => {
        const result = <any>response;

        if (result && result.token) {
          localStorage.setItem('token', result.token);

          const jwt = new JwtHelperService();
          this.currentUser = jwt.decodeToken(localStorage.getItem('token'));

          return true;
        } else {
          return false;
        }
      }));
  }


  logout() {
    localStorage.removeItem('token');
    this.currentUser = null;
  }

  loginRequired() {
    return this.isLoginRequired;
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token === null) { return false; }

    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    if (decodedToken.exp !== null) {
      this.expiredLogin = this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
      if (this.expiredLogin) {
        console.warn('Token expired', {decodedToken});
      }
      const expirationDate = this.jwtHelper.getTokenExpirationDate(localStorage.getItem('token'));
      return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
    }

    if (token === null || decodedToken.iat === null) { return false; }
    return true;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  isSecuredByLogin(): boolean {
    return true;
  }
}

