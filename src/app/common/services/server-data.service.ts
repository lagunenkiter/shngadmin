import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {parse} from "url";
import {ServerInfo} from '../../models/server-info';
import {catchError, map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {of} from 'rxjs';


let dataUrl = 'http://';
let host_ip = '';

@Injectable({
  providedIn: 'root'
})
export class ServerDataService {

  baseUrl: string;
  shng_serverinfo: ServerInfo = <ServerInfo>{'itemtree_fullpath': true};


  constructor(private http: HttpClient, private translate: TranslateService, @Inject('BASE_URL') baseUrl: string) {

    console.log('ServerDataService.constructor:');

    this.baseUrl = baseUrl;

    const parsedUrl = parse(baseUrl);
    // console.log({parsedUrl});
    // let apiUrl = parsedUrl.protocol + '//' + parsedUrl.host + '/api/';
    // Omit the domain to get automatic whitelisting in angular2-jwt
    let apiUrl = '/api/';

    if (host_ip === '') {
      host_ip = location.host;
      if (host_ip === 'localhost:4200') {
        dataUrl = baseUrl + 'assets/testdata/';
        apiUrl = dataUrl + 'api/';
      } else {
        dataUrl = baseUrl;
      }
      // console.log({host_ip});
      sessionStorage.setItem('apiUrl', apiUrl);
      sessionStorage.setItem('dataUrl', dataUrl);

    }

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    this.getShngServerinfo()
      .subscribe(
        (response: ServerInfo) => {
          this.shng_serverinfo = response;
          console.log('ServerDataService.getShngServerinfo', {response});
          sessionStorage.setItem('default_language', this.shng_serverinfo.default_language);
          sessionStorage.setItem('client_ip', this.shng_serverinfo.client_ip);
          sessionStorage.setItem('tz', this.shng_serverinfo.tz);
          sessionStorage.setItem('tzname', this.shng_serverinfo.tzname);
          sessionStorage.setItem('itemtree_fullpath', this.shng_serverinfo.itemtree_fullpath.toString());
          sessionStorage.setItem('itemtree_searchstart', this.shng_serverinfo.itemtree_searchstart.toString());

          this.translate.use(this.shng_serverinfo.default_language);
        },
        (error) => {
          console.warn('DataService: getShngServerinfo():', {error});
        }
      );


  }


  getShngServerinfo() {
    const url = dataUrl + 'shng_serverinfo.json\\';
    // console.log('getShngServerinfo: url: ' + url);
    return this.http.get(url);
  }



  getShngServerStatus() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'status/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('ServerDataService (getShngServerStatus): Could not read server status' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  restartShngServer() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'restart/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('ServerDataService (RestartShngServer): Could not restart server' + ' - ' + err.error.error);
          return of({});
        })
      );
  }

}

