
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {SchedulersApiService} from '../common/services/schedulers-api.service';
import {ServerApiService} from '../common/services/server-api.service';

import { ServerInfo } from '../common/models/server-info';
import {TranslateService} from '@ngx-translate/core';
import {SharedService} from '../common/services/shared.service';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  providers: []
})

export class ServicesComponent implements OnInit {

//  schedulerinfo: SchedulerInfo[];

  constructor(private http: HttpClient,
              private translate: TranslateService,
              private shared: SharedService,
              private dataService: SchedulersApiService,
              private dataServiceServer: ServerApiService) {
  }

  serverInfo = <ServerInfo>{};
  default_language: string;
  shng_status: string;
  status_errorcount: number = 0;

  valid_languagelist = [];

  valid_default_language = '          ';
  selected_language = null;
  shng_statuscode: number = 0;


  ngOnInit() {
    console.log('ServicesComponent.ngOnInit');

    this.shng_status = '?';
    this.default_language = sessionStorage.getItem('default_language');

    this.dataServiceServer.getServerinfo()
      .subscribe(
        (response) => {
          this.serverInfo = <ServerInfo> response;

          this.getShngStatus();

//          this.valid_languagelist = [{label: 'English', value: 'en'}, {label: 'Deutsch', value: 'de'}, {label: 'Français', value: 'fr'}, {label: 'Polski', value: 'pl'}];
          this.valid_languagelist = [
            {label: 'English', value: 'en'},
            {label: 'Deutsch', value: 'de'},
            {label: 'Français', value: 'fr'}
            ];

          // this.valid_default_language = 'Deutsch';
          this.selected_language = this.default_language;
        }
      );

  }


  setLanguage() {
    console.log('setLanguage', this.selected_language);
    sessionStorage.setItem('default_language', this.selected_language);
    this.shared.setGuiLanguage();
    this.default_language = sessionStorage.getItem('default_language');
  }


  // -------------------------------------------------------
  // translate status text of SmartHomeNG
  //
  translate_shngStatus(text) {
    const translated_text = this.translate.instant('SHNG_STATE.' + text);
//    if (translated_text.startsWith('SHNG_STATE.')) {
//      return text;
//    }
    return translated_text;
  }


  // -------------------------------------------------------
  // poll the status of SmartHomeNG and schedule next poll
  //
  getShngStatus() {
    // duration in seconds
    const interval1 = 5000;    // standard polling: every 5 seconds
    const interval2 = 1000;    // polling while (re)starting: every second
    const interval3 = 2000;    // polling while in error state (shng not running)
    this.dataServiceServer.getShngServerStatus()
      .subscribe(
        (response) => {
          const res = <any> response;
          if (res.code === undefined) {
            // shng is not running
            this.status_errorcount += 1;
            console.log('getShngStatus', 'SmartHomeNG not running');
            this.shng_status = '';
          } else {
            console.log('getShngStatus', res.code, res.text);
            this.shng_statuscode = res.code;
            this.shng_status = this.translate_shngStatus(res.text);
            this.status_errorcount = 0;
          }
          if (this.status_errorcount < 10) {
            // schedule next status check
            let interval = interval1;
            if (res.code !== 20) {
              // code = 20 -> status running
              if (this.status_errorcount === 0) {
                interval = interval2;
              } else {
                interval = interval3;
              }
            }
            this.sleep(interval).then(() => {
              this.getShngStatus();
            });
          } else {
            console.warn('getShngStatus', 'Statuspolling aborted');
            this.shng_status = this.translate_shngStatus('not active');
            this.shng_statuscode = -1;
          }
        }
      );
  }


  sleep (time) {
    // https://davidwalsh.name/javascript-sleep-function
    return new Promise((resolve) => setTimeout(resolve, time));
  }


  // -------------------------------------------------------
  // restart SmartHomeNG server application
  //
  restartShng() {
    this.dataServiceServer.restartShngServer()
      .subscribe(
        (response) => {
          const res = <any> response;
          console.log('restartShng', res.result);
          this.shng_status = this.translate_shngStatus('Restart clicked');
          this.shng_statuscode = -1;
        }
      );
  }


}
