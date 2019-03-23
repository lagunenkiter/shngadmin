
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FilesApiService {

  constructor(private http: HttpClient) { }


  readFile(filename) {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'files/' + filename + '/';

    if (apiUrl.includes('localhost')) {
      url += 'default.txt';
    }

    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error({err});
          console.error('FilesApiService (readFile): Could not read logfile ' + filename + ' - ' + err.error.error);

          return of('File not found!');
        })
      );
  }


  saveFile(filename, content) {
    // console.log('FilesApiService.saveFile');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'files/' + filename + '/';
    if (apiUrl.includes('localhost')) {
      url += 'default.txt';
    }

    if (apiUrl.includes('localhost')) {
      console.warn('FilesApiService.saveFile', 'Cannot save file in dev environment\n', '- filename: ', filename);

      return this.http.get(url, { responseType: 'text' })
        .pipe(
          map(response => {
            const result = response;
            return result;
          }),
          catchError((err: HttpErrorResponse) => {
            console.error('FilesApiService.saveFile: Could not read result data' + ' - ' + err.error.error);
            return of({});
          })
        );
    }

    return this.http.put(url, content, { responseType: 'text' })
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('ServicesApiService.CheckYamlText', '- config:', yamlText, '\nresult', {result});
            return result;
          } else {
            console.log('FilesApiService.saveFile', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('FilesApiService.saveFile: Could not save config data' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


}


