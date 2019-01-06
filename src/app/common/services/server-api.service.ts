
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';
import { parse } from 'url';
import { ServerInfo } from '../models/server-info';
import {SharedService} from './shared.service';



let dataUrl = 'http://';
let host_ip = '';

@Injectable({
  providedIn: 'root'
})
export class ServerApiService {
// export class ThreadsApiService {

  baseUrl: string;
  shng_serverinfo: ServerInfo = <ServerInfo>{'itemtree_fullpath': true};


  constructor(private http: HttpClient,
              private translate: TranslateService,
              private shared: SharedService,
              @Inject('BASE_URL') baseUrl: string) {

    console.log('ServerApiService.constructor:');

    this.baseUrl = baseUrl;

    const parsedUrl = parse(baseUrl);
    let apiUrl = '/api/';

    if (host_ip === '') {
      host_ip = location.host;
      if (host_ip === 'localhost:4200') {
        dataUrl = baseUrl + 'assets/testdata/';
        apiUrl = dataUrl + 'api/';
      } else {
        dataUrl = baseUrl;
      }
      sessionStorage.setItem('apiUrl', apiUrl);
      sessionStorage.setItem('dataUrl', dataUrl);

      sessionStorage.setItem('hostIp', host_ip.split(':')[0]);
      sessionStorage.setItem('wsPort', '2424');

    }


    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(this.shared.getFallbackLanguage());


    this.getServerinfo()
      .subscribe(
        (response: ServerInfo) => {
          this.shng_serverinfo = response;
        },
        (error) => {
          console.warn('DataService: getShngServerinfo():', {error});
        }
      );


  }


  getServerinfo() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'serverinfo/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          this.shng_serverinfo = <ServerInfo> response;
          const result = response;
          sessionStorage.setItem('default_language', this.shng_serverinfo.default_language);
          sessionStorage.setItem('client_ip', this.shng_serverinfo.client_ip);
          sessionStorage.setItem('tz', this.shng_serverinfo.tz);
          sessionStorage.setItem('tzname', this.shng_serverinfo.tzname);
          sessionStorage.setItem('itemtree_fullpath', this.shng_serverinfo.itemtree_fullpath.toString());
          sessionStorage.setItem('itemtree_searchstart', this.shng_serverinfo.itemtree_searchstart.toString());
          sessionStorage.setItem('core_branch', this.shng_serverinfo.core_branch);
          sessionStorage.setItem('plugins_branch', this.shng_serverinfo.plugins_branch);
          const hostip = sessionStorage.getItem('hostIp');
          if (hostip === 'localhost') {
            sessionStorage.setItem('wsHost', this.shng_serverinfo.websocket_host);
          } else {
            sessionStorage.setItem('wsHost', hostip);
          }
          sessionStorage.setItem('wsPort', this.shng_serverinfo.websocket_port);

          this.shared.setGuiLanguage();
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('ServerApiService (getServerinfo): Could not read serverinfo data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  // get Status of shNG software
  getShngServerStatus() {
    // console.log('getShngServerStatus')
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'status/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          return response;
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.error.error !== undefined) {
            console.error('ServerApiService (getShngServerStatus): Could not read server status' + ' - ' + err.error.error);
//          } else {
//            console.warn('ServerApiService (getShngServerStatus): SmartHomeNG is not running');
          }
          return of({});
        })
      );
  }


  // restart shNG software
  restartShngServer() {
    // console.log('restartShngServer')
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'restart/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          return response;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('ServerApiService (RestartShngServer): Could not restart server' + ' - ' + err.error.error);
          return of({});
        })
      );
  }

}




