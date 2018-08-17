import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { DataService } from './data.service';
import {stringDistance} from 'codelyzer/util/utils';


import { ServerinfoType } from './interfaces';


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

  constructor(private http: HttpClient) {
  }


  ngOnInit() {
  }

}

