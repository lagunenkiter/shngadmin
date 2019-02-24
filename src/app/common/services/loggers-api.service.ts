
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


  constructor(private http: HttpClient) { }


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
          console.error('LogsApiService (getLogs): Could not read logs data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }

}


