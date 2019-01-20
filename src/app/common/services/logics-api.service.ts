
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LogicsApiService {

  constructor(private http: HttpClient) { }


  getLogics() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logics/';
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
          console.error('LogicsApiService (getLogics): Could not read logics data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }

}

