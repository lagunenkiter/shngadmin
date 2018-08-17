
import {APP_BASE_HREF} from '@angular/common';
import {Inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerinfoType} from './interfaces';
import {TranslateService} from '@ngx-translate/core';

let url_start = 'http://';
let host_ip = '';
let shng_serverinfo: ServerinfoType = <ServerinfoType>{'itemtree_fullpath': true};


@Injectable({
  providedIn: 'root'
})


export class DataService implements OnInit {

//  shngServerinfo: any = {};
//  host_ip = '';
//  url_start = 'http://';
  href = '';

  constructor(private http: HttpClient, private translate: TranslateService, @Inject('BASE_URL') baseUrl: string) {

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    if (host_ip === '') {
      host_ip = location.host;
      if (host_ip === 'localhost:4200') {
        url_start = 'http://localhost:4200/assets/testdata/';
      } else {
        url_start = baseUrl;
      }
      console.log('url_start: ' + url_start);

      this.getShngServerinfo()
        .subscribe(
          (response: ServerinfoType) => {
            console.log('DataService (constructor) -> getShngServerinfo:');
            console.log(response);
            shng_serverinfo = response;
            this.translate.use(this.getconfigDefaultLanguage());
//          this.translate.use(shng_serverinfo.default_language);
//          this.itemtree_fullpath = shng_serverinfo.itemtree_fullpath;
            // console.log('this.shng_serverinfo.default_language: ' + this.shng_serverinfo.default_language);
//          this.client_ip = shng_serverinfo.client_ip;
            // console.log('this.shng_serverinfo.client_ip: ' + this.shng_serverinfo.client_ip);
          },
          (error) => {
            console.log('DataService: getShngServerinfo():');
            console.log(error)
          }
        );
    }
  }


  ngOnInit() {
  }

  getHostIp() {
    return host_ip;
  }



  getconfigItemtreeFullpath() {
    console.log('getconfigItemtreeFullpath: itemtree_fullpath=' + shng_serverinfo.itemtree_fullpath);
    return shng_serverinfo.itemtree_fullpath;
  }

  getconfigItemtreeSearchstart() {
    console.log('getconfigItemtreeSearchstart: itemtree_searchstart=' + shng_serverinfo.itemtree_searchstart);
    return shng_serverinfo.itemtree_searchstart;
  }

  getconfigDefaultLanguage() {
    console.log('getconfigDefaultLanguage: default_language=' + shng_serverinfo.default_language);
    return shng_serverinfo.default_language;
  }


  getconfig(key) {
    return shng_serverinfo[key];
  }


  getShngServerinfo() {
    const url = url_start + 'shng_serverinfo.json\\';
    // console.log('getShngServerinfo: url: ' + url);
    return this.http.get(url);
  }


  getSysteminfo() {
    const url = url_start + 'systeminfo.json\\';
    // console.log('getSysteminfo: url: ' + url);
    return this.http.get(url);
  }


  getPypiinfo() {
    const url = url_start + 'pypi.json\\';
    // console.log('getPypiinfo: url: ' + url);
    return this.http.get(url);
  }


  getItemtree() {
    const url = url_start + 'items.json\\';
    // console.log('getItemtree: url: ' + url);
    return this.http.get(url);
  }


  getItemDetails(itempath) {
//    const url = this.url_start + 'item_detail_json.html?item_path=';
//    const url = 'http://10.0.0.174:1234/admin/item_detail_json.html?item_path=beoremote';

    if (host_ip === 'localhost:4200') {
      if (itempath === 'beoremote.beo4command') {
        const url = url_start + 'item_detail_json.html';

        console.log('getItemDetails: url: ' + url);
        return this.http.get(url);
      } else {
        console.log('getItemDetails: url: <' + itempath + '>');
        return itempath;
      }
    } else {
      const url = url_start + 'item_detail_json.html?item_path=' + itempath;
      console.log('getItemDetails: url: ' + url);
      return this.http.get(url);
    }
  }

  changeItemValue(itempath, value) {
    if (host_ip === 'localhost:4200') {
      const url = url_start + 'item_detail_json.html';

      console.log('postItemValue: url: ' + url);
      return this.http.get(url);
    } else {
      const url = url_start + 'item_change_value.html?item_path=' + itempath + '&value=' + value;
      console.log('postItemValue: url: ' + url);
      return this.http.get(url);
    }
  }


  getSchedulerinfo() {
    const url = url_start + 'scheduler.json\\';
    // console.log('getSchedulerinfo: url: ' + url);
    return this.http.get(url);
  }


  getPlugininfo() {
    const url = url_start + 'plugininfo.json\\';
    // console.log('getPlugininfo: url: ' + url);
    return this.http.get(url);
  }


  getSceneinfo() {
    const url = url_start + 'scenes.json\\';
    // console.log('getSceneinfo: url: ' + url);
    return this.http.get(url);
  }


  getThreadinfo() {
    const url = url_start + 'threads.json\\';
    // console.log('getThreadinfo: url: ' + url);
    return this.http.get(url);
  }
}


