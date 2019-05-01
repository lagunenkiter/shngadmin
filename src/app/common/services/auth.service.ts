
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
  isLoginRequiredCount = 0;
  expiredLogin: boolean;

  ttl: number = 0;            // time to live for jwt token
  renewAfter: number = 0;
  tokenRenewal: boolean;
  isRenewing: boolean;

  logTimestamp: number = 0;

  constructor(private http: HttpClient,
              private dataService: OlddataService,
              public jwtHelper: JwtHelperService) {


    this.isLoginRequired = true;
    const token = localStorage.getItem('token');

    this.tokenRenewal = true;
    this.isRenewing = false;

    // const timestamp = this.getTimestamp();
    // const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    // console.warn('authService.constructor', {decodedToken} , this.logTimestamp, {timestamp}, this.logTimestamp < timestamp, this.logTimestamp - timestamp);
  }


  getTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  }


  login(credentials) {
    console.log('authService.login()');
    this.logTimestamp = this.getTimestamp();
    // console.log('timestamp', this.logTimestamp);
    // this.logTimestamp += 500;

    const send_hash = 'shNG0160$';
    // const hostip = this.dataService.getHostIp();
    const hostip = sessionStorage.getItem('hostIp');


    const send_credentials = <any>{};

    send_credentials.username = '';
    if (credentials.username !== '') {
      send_credentials.username = sha512(credentials.username + send_hash);
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
      // if (this.currentUser.ttl !== undefined) {
      //   this.ttl = this.currentUser.ttl;
      // }
      this.renewAfter = this.currentUser.iat + (this.ttl*60*60 / 2);
      const decodedToken = this.currentUser;
      console.log('authService.login (localhost)', this.ttl, {decodedToken}, this.renewAfter);

      // if login succeeds with an empty username, no login is required
      this.isLoginRequired = !(credentials.username === '');
      this.expiredLogin = false;

      return of(true);
    }

    // if not in develop environment:
    // return this.http.post('http://smarthomeng.fritz.box:1234/api/authenticate/user', JSON.stringify(send_credentials))
    // const apiUrl = sessionStorage.getItem('apiUrl');
    const apiUrl = '/api/';
    console.log('login', apiUrl + 'authenticate/user', {send_credentials});
    return this.http.post(apiUrl + 'authenticate/user', JSON.stringify(send_credentials))
      .pipe(map(response => {
        const result = <any>response;

        let anon = '';
        if (credentials.username === '') {
          anon = 'anonymous ';
        }
        if (result && result.token) {
          localStorage.setItem('token', result.token);

          const jwt = new JwtHelperService();
          // this.currentUser = jwt.decodeToken(localStorage.getItem('token'));
          this.currentUser = this.jwtHelper.decodeToken(localStorage.getItem('token'));
          // if (this.currentUser.ttl !== undefined) {
          //   this.ttl = this.currentUser.ttl;
          // }
          const decodedToken = this.currentUser;
          this.ttl = Math.round((decodedToken.exp - decodedToken.iat) / 60 / 60 * 100) / 100;
          this.renewAfter = decodedToken.iat + (this.ttl * 60 * 60 / 2);
          this.tokenRenewal = true;

          // console.log('authService.login', this.ttl, {decodedToken}, this.renewAfter);

          // if login succeeds with an empty username, no login is required
          this.isLoginRequired = !(credentials.username === '');

          console.log(anon + 'login:', 'success');
          this.expiredLogin = false;
          return true;
        } else {
          console.log(anon + 'login:', 'fail');
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


  getNewToken() {
    // return this.http.post('http://smarthomeng.fritz.box:1234/api/authenticate/user', JSON.stringify(send_credentials))
    // const apiUrl = sessionStorage.getItem('apiUrl');
    const apiUrl = '/api/';
    console.log('getNewToken', apiUrl + 'authenticate/renew');
    return this.http.put(apiUrl + 'authenticate/renew', '')
      .pipe(map(response => {
        const result = <any>response;
        return result.token;

      }));
  }


  renewToken() {
    // console.warn('authService.renewToken()');

    if (this.isRenewing) {
      // console.warn('renewToken: Already renewing');
      return;
    }

    this.logTimestamp = this.getTimestamp();
    const oldToken = localStorage.getItem('token');
    const hostip = sessionStorage.getItem('hostIp');

    let newToken = oldToken;
    if (hostip === 'localhost') {
      console.error('localhost -> Token renewal is disabled');
    } else {
      this.isRenewing = true;
      this.getNewToken()
        .subscribe(
          (response) => {
              newToken = response;
              const decodedNewToken = this.jwtHelper.decodeToken(newToken);
              const newttl = Math.round((decodedNewToken.exp - decodedNewToken.iat) / 60 / 60 * 100) / 100;
              // console.log('authService.renewToken', {decodedNewToken});

              if (oldToken === newToken) {
                console.warn('- Token renewal is disabled');
                this.tokenRenewal = false;

              } else {
                localStorage.setItem('token', newToken);
                this.ttl = Math.round((decodedNewToken.exp - decodedNewToken.iat) / 60 / 60 * 100) / 100;
                this.renewAfter = decodedNewToken.iat + (this.ttl * 60 * 60 / 2);
              }
              this.isRenewing = false;
          }
        );

    }

  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token === null) { return false; }

    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    const timestamp = this.getTimestamp();
    if (this.ttl === 0) {
      this.ttl = Math.round((decodedToken.exp - decodedToken.iat) / 60 / 60 * 100) / 100;
      this.renewAfter = decodedToken.iat + (this.ttl * 60 * 60 / 2);
    }
    if (this.renewAfter === 0) {
      this.renewAfter = decodedToken.iat + (this.ttl * 60 * 60 / 2);
    }

    const expirationDate = this.jwtHelper.getTokenExpirationDate(localStorage.getItem('token'));
    const loggedIn = !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));

    if (loggedIn && this.logTimestamp < timestamp) {
      console.log('Login expires in ' + Math.round((decodedToken.exp - timestamp) / 6) / 10 + ' Min');
      if (this.tokenRenewal) {
        console.log('Login renew in ' + Math.round((this.renewAfter - timestamp) / 6) / 10 + ' Min');
      }

      const timeLeftMin = (decodedToken.exp - timestamp) / 60;
      this.logTimestamp = timestamp + 60;
    }

    if (decodedToken.exp !== null) {

      const hostip = sessionStorage.getItem('hostIp');
      if (hostip === 'localhost') {
        return true;
      }
      if (!this.expiredLogin) {
        this.expiredLogin = this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
        if (this.expiredLogin) {
          console.warn('Token expired', {decodedToken});
        }
      } else {
        // console.warn('Token already expired');
      }

      if (this.tokenRenewal && loggedIn && this.renewAfter < timestamp) {
        this.renewToken();
      }

      return loggedIn;
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

