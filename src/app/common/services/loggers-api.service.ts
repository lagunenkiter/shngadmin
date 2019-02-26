
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { LoggersType } from '../models/loggers-info';
import { ServerApiService } from './server-api.service';
import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggersApiService {


  constructor(private http: HttpClient) {
  }


  getLoggers() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'loggers/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }
    return this.http.get<LoggersType>(url)
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LoggersApiService (getLogs): Could not read logs data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  setLoggerLevel(logger, level) {
    // console.log('LoggersApiService.setLoggerLevel');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'loggers/' + logger + '?level=' + level;
    if (apiUrl.includes('localhost')) {
      url += 'default.txt';
    }

    if (apiUrl.includes('localhost')) {
      console.warn('LoggersApiService.setLoggerLevel', 'Cannot set level dev environment\n', '- logger:', logger, 'level:', level);

      return this.http.get(url)
        .pipe(
          map(response => {
            const result = response;
            return result;
          }),
          catchError((err: HttpErrorResponse) => {
            console.error('LoggersApiService.setLoggerLevel: Could not read result data' + ' - ' + err.error.error);
            return of({});
          })
        );
    }

    return this.http.put(url, 'xxx')
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('ServicesApiService.ConvertToYamlText', '- config:', confText, '\nresult', {result});
            return result;
          } else {
            console.log('LoggersApiService.setLoggerLevel', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LoggersApiService.setLoggerLevel: Could not set logger level' + ' - ' + err.error.error);
          return of({});
        })
      );
  }

}
