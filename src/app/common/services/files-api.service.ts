
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FilesApiService {

  constructor(private http: HttpClient) { }


  readFile(filetype, filename = '') {
    // console.log('FilesApiService.readFile()', {filename});

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'files/' + filetype + '/';

    if (apiUrl.includes('localhost')) {
      if (filename === '') {
        url += 'default' + '.txt';
      } else {
        url += filename + '.txt';
      }
    } else {
      if (filename !== '') {
        url += '?filename=' + filename;
      }
    }

    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error({err});
          if (filename === '') {
            console.error('FilesApiService (readFile): Could not read filetype \'' + filetype + '\' - error: ' + err.error.error);
          } else {
            console.error('FilesApiService (readFile): Could not read filetype \'' + filetype + '\', filename \'' + filename + '\' - error: ' + err.error.error);
          }

          return of('');
        })
      );
  }


  saveFile(filetype, filename = '', content = '') {
    // console.log('FilesApiService.saveFile');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'files/' + filetype + '/';
    if (apiUrl.includes('localhost')) {
      if (filename === '') {
        url += 'default' + '.txt';
      } else {
        url += filename + '.txt';
      }
    }

    if (filename !== '') {
      url += '?filename=' + filename;
    }

    if (apiUrl.includes('localhost')) {
      if (filename === '') {
        console.warn('FilesApiService.saveFile', 'Cannot save file in dev environment\n', '- filetype: ', filetype);
      } else {
        console.error('FilesApiService.saveFile: Cannot save file in dev environment filetype \'' + filetype + '\', filename \'' + filename + '\'');
      }

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


  deleteFile(filetype, filename = '') {
    console.log('FilesApiService.deleteFile()', {filename});

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'files/' + filetype + '/';

    if (apiUrl.includes('localhost')) {
      if (filename === '') {
        url += 'default' + '.txt';
      } else {
        url += filename + '.txt';
      }
    } else {
      if (filename !== '') {
        url += '?filename=' + filename;
      }
    }

    console.log('FilesApiService.deleteFile()', {url});

    return this.http.delete(url, { responseType: 'text' })
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error({err});
          if (filename === '') {
            console.error('FilesApiService.deleteFile(): Could not delete filetype \'' + filetype + '\' - error: ' + err.error.error);
          } else {
            console.error('FilesApiService.deleteFile(): Could not delete filetype \'' + filetype + '\', filename \'' + filename + '\' - error: ' + err.error.error);
          }

          return of('');
        })
      );
  }


  getfileList(filetype) {
    console.log('FilesApiService.getfileList()', {filetype});

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'files/' + filetype + '/';
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
          console.error('FilesApiService.getfileList: Could not read file list' + ' - ' + err.error.error);
          return of({});
        })
      );
  }

}


