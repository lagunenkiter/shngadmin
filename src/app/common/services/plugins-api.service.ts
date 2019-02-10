
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';
import {PluginsConfig} from '../models/plugins-config';


@Injectable({
  providedIn: 'root'
})
export class PluginsApiService {

  constructor(private http: HttpClient) {
  }


  // ---------------------------------------------------------------------
  //  Get information about the plugins installed in ../plugins directory
  //
  getInstalledPlugins() {
    // console.log('PluginsApiService.getInstalledPlugins');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'plugins/installed/';
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
          console.error('PluginsApiService (getInstalledPlugins): Could not read plugins data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  // ------------------------------------------------------------
  //  Get configuration information about all configured plugins
  //  - for plugins-config.component
  //
  getPluginsConfig() {
    // console.log('PluginsApiService.getPluginsConfig');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'plugins/config/';
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
          console.error('PluginsApiService (getPluginsConfig): Could not read plugins data' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


  // ------------------------------------------------------------
  //  Get configuration information about all configured plugins
  //  - for plugins.component
  //
  getPluginsInfo() {
    // console.log('PluginsApiService.getPluginsInfo');

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'plugins/info/';
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
          console.error('PluginsApiService (getPluginsInfo): Could not read plugins data' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


  // -----------------------------------------------------------
  //  Update config of one plugin in etc/plugin.yaml on backend
  //
  setPluginConfig(pluginsection, config) {
    // console.log('PluginsApiService.setPluginConfig');

    const apiUrl = sessionStorage.getItem('apiUrl');
    const url = apiUrl + 'plugin/' + pluginsection + '/';
    if (apiUrl.includes('localhost')) {
      console.warn('PluginsApiService.setPluginConfig', 'Cannot simulate saving data in dev environment\n', '- config', config);
      return of(true);
    }

    return this.http.put(url, JSON.stringify(config))
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('PluginsApiService.setPluginConfig', '- config', config, '\nresult', {result});
            if (result.result === 'ok') {
              // console.log('PluginsApiService.setPluginConfig', 'success');
              return true;
            } else {
              console.log('PluginsApiService.setPluginConfig', 'fail');
              alert('PluginsApiService.setPluginConfig:\n' + result.result + '\n' + result.description);
              return false;
            }

          } else {
            console.log('PluginsApiService.setPluginConfig', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('PluginsApiService (setPluginConfig): Could not set plugin config data' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


  // -----------------------------------------------------------
  //  add a new config of one plugin in etc/plugin.yaml on backend
  //
  addPluginConfig(pluginsection, config) {
    // console.log('PluginsApiService.addPluginConfig');

    const apiUrl = sessionStorage.getItem('apiUrl');
    const url = apiUrl + 'plugin/' + pluginsection + '/';
    if (apiUrl.includes('localhost')) {
      console.warn('PluginsApiService.addPluginConfig', 'Cannot simulate saving data in dev environment\n', '- config', config);
      return of(true);
    }

    return this.http.post(url, JSON.stringify(config))
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            console.log('PluginsApiService.addPluginConfig', '- config', config, '\nresult', {result});
            if (result.result === 'ok') {
              console.log('PluginsApiService.addPluginConfig', 'success');
              return true;
//              return result;
            } else {
              console.log('PluginsApiService.addPluginConfig', 'fail');
              alert('PluginsApiService.addPluginConfig:\n' + result.result + '\n' + result.description);
              return false;
//              return result;
            }

          } else {
            console.log('PluginsApiService.addPluginConfig', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('PluginsApiService (addPluginConfig): Could not set plugin config data' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


  // -----------------------------------------------------------
  //  add a new config of one plugin in etc/plugin.yaml on backend
  //
  deletePluginConfig(pluginsection) {
    // console.log('PluginsApiService.deletePluginConfig\n', {pluginsection});

    const apiUrl = sessionStorage.getItem('apiUrl');
    const url = apiUrl + 'plugin/' + pluginsection + '/';
    if (apiUrl.includes('localhost')) {
      console.warn('PluginsApiService.deletePluginConfig', 'Cannot simulate deleting data in dev environment\n', '- section', pluginsection);
      return of(true);
    }

    return this.http.delete(url)
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            console.log('PluginsApiService.deletePluginConfig', '- section', pluginsection, '\nresult', {result});
            if (result.result === 'ok') {
              console.log('PluginsApiService.deletePluginConfig', 'success');
              return true;
//              return result;
            } else {
              console.log('PluginsApiService.deletePluginConfig', 'fail');
              alert('PluginsApiService.addPluginConfig:\n' + result.result + '\n' + result.description);
              return false;
//              return result;
            }

          } else {
            console.log('PluginsApiService.deletePluginConfig', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('PluginsApiService (deletePluginConfig): Could not set plugin config data' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


}
