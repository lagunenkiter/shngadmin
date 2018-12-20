
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ScenesApiService {

  constructor(private http: HttpClient) { }


  getScenes() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'scenes/';
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
          console.error('ScenesApiService (getScenes): Could not read scenes data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }

}


