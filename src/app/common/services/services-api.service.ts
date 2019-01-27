
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServicesApiService {

  constructor(private http: HttpClient) { }


  // -----------------------------------------------------------
  //  Send yaml text to check if it is conform to specification
  //
  CheckYamlText(yamlText) {
    // console.log('ServicesApiService.CheckYamlText');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'services/yamlcheck/';
    if (apiUrl.includes('localhost')) {
      url += 'default.txt';
    }

    if (apiUrl.includes('localhost')) {
      console.warn('ServicesApiService.CheckYamlText', 'Cannot check yaml text in dev environment\n', '- yamlText: ', yamlText);

      return this.http.get(url, { responseType: 'text' })
        .pipe(
          map(response => {
            const result = response;
            return result;
          }),
          catchError((err: HttpErrorResponse) => {
            console.error('ServicesApiService (CheckYamlText): Could not read result data' + ' - ' + err.error.error);
            return of({});
          })
        );
    }

    return this.http.put(url, yamlText, { responseType: 'text' })
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('ServicesApiService.CheckYamlText', '- config:', yamlText, '\nresult', {result});
            return result;
          } else {
            console.log('ServicesApiService.CheckYamlText', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('ServicesApiService.CheckYamlText: Could not set plugin config data' + ' - ' + err.error.error);
          return of({});
        })
      );


  }


}

