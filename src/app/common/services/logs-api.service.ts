
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { LogsType } from '../models/logfiles-info';
import { ServerApiService } from './server-api.service';
import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LogsApiService {

  constructor(private http: HttpClient,
              private dataService: ServerApiService) { }


  getLogs() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logs/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }
    return this.http.get<LogsType>(url)
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

  readLogfile(filename, chunk = null) {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logs/' + filename;

    if (chunk === null) { chunk = 1; }
    if (chunk !== null) {
      if (apiUrl.includes('localhost')) {
        url += '_chunk' + String(chunk);
      } else {
        url += '?chunk=' + String(chunk);
      }
    }

    // return this.http.get(url, { responseType: 'text' })
    return this.http.get(url)
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error({err});
          console.error('LogsApiService (readLogfile): Could not read logfile ' + filename + ' - ' + err.error.error);
          return of('File not found!');
        })
      );
  }
}


