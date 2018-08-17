import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import * as $ from 'jquery';

import { DataService } from '../data.service';
import { SysteminfoType } from '../interfaces';
import { PypiType } from '../interfaces';
import { SharedService } from '../shared.service';



@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css'],
  providers: [DataService]
})
export class SystemComponent implements OnInit {

  systeminfo: SysteminfoType = <SysteminfoType>{};
  pypiinfo: PypiType[];
  reqinfodisplay: {};
  documentationcount = 0;
  testsuitecount = 0;
  norequirementcount = 0

  os_uptime = '';
  sh_uptime = '';


  constructor(private http: HttpClient,
              private dataService: DataService,
              private translate: TranslateService,
              public shared: SharedService) {
  }


  static resizeDisclosure() {
    const browserHeight = $(window).height();
    const disclosure = $('#disclosuretext');
    // const offsetTop = disclosure.offset().top;
    // initially offsetTop is off by a number of pixels. Correction: a fixed offset
    const offsetTop = 110;
    const height = String(Math.round((-1) * (offsetTop) - 35 + browserHeight) + 'px');
    disclosure.css('height', height);
    disclosure.css('maxHeight', height);
  }


  ngOnInit() {
    this.dataService.getSysteminfo()
      .subscribe(
        (response: SysteminfoType) => {
          console.log('getSysteminfo:');
          console.log(response);
          this.systeminfo = response;

          this.os_uptime = this.shared.ageToString(this.systeminfo.uptime);
          this.sh_uptime = this.shared.ageToString(this.systeminfo.sh_uptime);
        },
        (error) => {
          console.log('SystemComponent: dataService.getSysteminfo():');
          console.log(error);
        }
      );


    this.dataService.getPypiinfo()
      .subscribe(
        (response: PypiType[]) => {
          this.pypiinfo = response;

          // count if documentation requirements exist
          this.documentationcount = 0;
          for (let i = 0; i < this.pypiinfo.length; ++i) {
            if (this.pypiinfo[i].is_required_for_docbuild === true) {
              this.documentationcount++;
            }
          }

          // count if testsuite requirements exist
          this.testsuitecount = 0;
          for (let i = 0; i < this.pypiinfo.length; ++i) {
            if (this.pypiinfo[i].is_required_for_testsuite === true) {
              this.testsuitecount++;
            }
          }

          // count if package without requirements exist
          this.norequirementcount = 0;
          for (let i = 0; i < this.pypiinfo.length; ++i) {
            if (this.pypiinfo[i].is_required === false && this.pypiinfo[i].is_required_for_docbuild === false &&
              this.pypiinfo[i].is_required_for_testsuite === false) {
              this.norequirementcount++;
            }
          }

          this.reqinfodisplay = {}
          for (let i = 0; i < this.pypiinfo.length; ++i) {
            this.reqinfodisplay[this.pypiinfo[i].name] = this.buildreqinfostring(this.pypiinfo[i]);
          }

        },
        (error) => console.log('SystemComponent: dataService.getPypiinfo():' + error)
      );


    window.addEventListener('resize', SystemComponent.resizeDisclosure, false);
    SystemComponent.resizeDisclosure();

    let filepath = '/3rdpartylicenses.txt';
    if (this.dataService.getHostIp() !== 'localhost:4200') {
      filepath = '/admin' + filepath;
    }
    this.http.get(filepath, {responseType: 'text'}).subscribe(response => {
      const message = response.toString();
      $('#disclosuretext').text(message);
    });
  }


  buildreqinfostring(element) {

    /* Build String for requirements column */
    let reqString = '';

    if (element['vers_req_min'] !== '' && element['vers_req_max'] !== '' && (element['vers_req_min'] !== element['vers_req_max'])) {
      // MIN and MAX filled, MIN != MAX
      reqString += element['vers_req_min'] + ' <= ';
    } else {
      if (element['vers_req_min'] !== '' && element['vers_req_max'] != '' && (element['vers_req_min'] == element['vers_req_max'])) {
        // ELSE: MIN and MAX filled, MIN == MAX
        reqString += ' == ' + element['vers_req_min'];
      } else {
        // ELSE: MIN or MAX filled * /
        if (element['vers_req_min'] !== '') {
          reqString += ' >= ' + element['vers_req_min'];
        } else if (element['vers_req_max'] !== '') {
          reqString += '<= ' + element['vers_req_max'];
        }
      }

      if (reqString === '') {
        // Element required due to Doku, Testsuite or SmartHomeNG in general, but no MIN and MAX version -> all versions valid * /
        reqString = ' == *';
      }
    }

    return reqString;
  }
}
