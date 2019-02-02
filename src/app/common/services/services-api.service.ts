
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
  //  Send eval data to check if it is conform to Python specification
  //
  CheckEvalData(evalData) {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'services/evalcheck/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }

    if (apiUrl.includes('localhost')) {
      console.warn('ServicesApiService.CheckEvalData', 'Cannot check eval data in dev environment\n', '- yamlText: ', evalData);

      return this.http.get(url)
        .pipe(
          map(response => {
            const result = response;
            return result;
          }),
          catchError((err: HttpErrorResponse) => {
            console.error('ServicesApiService (CheckEvalData): Could not read result data' + ' - ' + err.error.error);
            return of({});
          })
        );
    }

    return this.http.put(url, evalData)
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('ServicesApiService.CheckEvalData', '- config:', evalData, '\nresult', {result});
            return result;
          } else {
            console.log('ServicesApiService.CheckEvalData', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('ServicesApiService.CheckEvalData: Could not set plugin config data' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


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


  // -----------------------------------------------------------
  //  Send yaml text to check if it is conform to specification
  //
  ConvertToYamlText(confText) {
    // console.log('ServicesApiService.CheckYamlText');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'services/yamlconvert/';
    if (apiUrl.includes('localhost')) {
      url += 'default.txt';
    }

    if (apiUrl.includes('localhost')) {
      console.warn('ServicesApiService.ConvertToYamlText', 'Cannot convert conf text to yaml in dev environment\n', '- yamlText: ', confText);

      return this.http.get(url, {responseType: 'text'})
        .pipe(
          map(response => {
            const result = response;
            return result;
          }),
          catchError((err: HttpErrorResponse) => {
            console.error('ServicesApiService (ConvertToYamlText): Could not read result data' + ' - ' + err.error.error);
            return of({});
          })
        );
    }

    return this.http.put(url, confText, {responseType: 'text'})
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('ServicesApiService.ConvertToYamlText', '- config:', confText, '\nresult', {result});
            return result;
          } else {
            console.log('ServicesApiService.ConvertToYamlText', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('ServicesApiService.ConvertToYamlText: Could not set plugin config data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  getCacheOrphans() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'services/cachecheck/';
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
          console.error('ServicesApiService (getCacheOrphans): Could not read cache orphans data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  deleteCacheFile(filename) {
    // console.log('ServicesApiService.deleteCacheFile');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'services/cachefile_delete?filename=' + filename;
    if (apiUrl.includes('localhost')) {
      url += 'default.txt';
    }

    if (apiUrl.includes('localhost')) {
      console.warn('ServicesApiService.deleteCacheFile', 'Cannot delete cache file in dev environment\n', '- filename:', filename);

      return this.http.get(url)
        .pipe(
          map(response => {
            const result = response;
            return result;
          }),
          catchError((err: HttpErrorResponse) => {
            console.error('ServicesApiService (deleteCacheFile): Could not read result data' + ' - ' + err.error.error);
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
            console.log('ServicesApiService.deleteCacheFile', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('ServicesApiService.deleteCacheFile: Could not set plugin config data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }

}

