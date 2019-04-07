
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


  setLogicState(logicName, action, filename = '') {
    // valid actions are: 'trigger', 'enable', 'disable', 'load', 'unload', 'reload', 'delete', 'create'
    action = action.toLowerCase();
    console.warn('LogicsApiService.setLogicState', {logicName}, {action});

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logics/' + logicName + '?action=' + action;
    if (filename !== '') {
      url += '&filename=' + filename;
    }
    if (apiUrl.includes('localhost')) {
      console.warn('LogicsApiService.setLogicState', 'Cannot simulate setting states in dev environment\n', '- logic', logicName, ', action', action);
      return of(true);
    }

    return this.http.put(url, JSON.stringify(''))
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('LogicsApiService.setLogicState', '- config', config, '\nresult', {result});
            if (result.result === 'ok') {
              // console.log('LogicsApiService.setLogicState', 'success');
              return true;
            } else {
              console.log('LogicsApiService.setLogicState', 'fail');
              alert('LogicsApiService.setLogicState:\n' + result.result + '\n' + result.description);
              return false;
            }

          } else {
            console.log('LogicsApiService.setLogicState', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.setLogicState: Could not set logic state' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


}


