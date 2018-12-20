
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { PluginConfig } from '../../models/plugin-config';
import { ServerDataService } from './server-data.service';


@Injectable({
  providedIn: 'root'
})
export class PluginService {

  constructor(private http: HttpClient,
              private dataService: ServerDataService) { }

  getPluginConfig() {
    const dataUrl = sessionStorage.getItem('dataUrl');
    return this.http.get<PluginConfig>(dataUrl + 'pluginconfig.json')
      .toPromise()
      .then(res => <PluginConfig>res)
      .then(data => { return data; });
  }

  getPluginMedatata(plugin) {
    const dataUrl = sessionStorage.getItem('dataUrl');
    const url_rest = 'plugin_metadata.json' + '?plugin=' + plugin;
    return this.http.get<any>(dataUrl + url_rest)
      .toPromise()
      .then(res => <any>res)
      .then(data => { return data; });
  }

}
