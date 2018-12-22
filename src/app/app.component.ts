import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServerApiService } from './common/services/server-api.service';
import { AuthService } from './common/services/auth.service';
import { ServerInfo } from './common/models/server-info';




// Allow ngx-translate to find translation files on other path than /assets/i18n/...
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';

  constructor(private http: HttpClient,
              private dataService: ServerApiService,
              private translate: TranslateService,
              public authService: AuthService) {

    console.log('AppComponent.constructor:');

//    translate.setDefaultLang('de');

    this.dataService.getServerinfo()
      .subscribe(
        (response: ServerInfo) => {
          this.dataService.shng_serverinfo = response;
          sessionStorage.setItem('default_language', this.dataService.shng_serverinfo.default_language);
          sessionStorage.setItem('client_ip', this.dataService.shng_serverinfo.client_ip);
          sessionStorage.setItem('tz', this.dataService.shng_serverinfo.tz);
          sessionStorage.setItem('tzname', this.dataService.shng_serverinfo.tzname);
          sessionStorage.setItem('itemtree_fullpath', this.dataService.shng_serverinfo.itemtree_fullpath.toString());
          sessionStorage.setItem('itemtree_searchstart', this.dataService.shng_serverinfo.itemtree_searchstart.toString());

          translate.use(this.dataService.shng_serverinfo.default_language);
        },
        (error) => {
          console.warn('DataService: getShngServerinfo():', {error});
        }
      );
  }


  ngOnInit() {
  }

}

