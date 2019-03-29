
import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService} from 'ngx-bootstrap/modal';

import {LogicsApiService} from '../../common/services/logics-api.service';
import {LogicsinfoType} from '../../common/models/logics-info';
import {OlddataService} from '../../common/services/olddata.service';
import {Log} from '@angular/core/testing/src/logger';

@Component({
  selector: 'app-logics',
  templateUrl: './logics-list.component.html',
  styleUrls: ['./logics-list.component.css'],
  providers: [OlddataService]
})
export class LogicsListComponent implements OnInit {
  logics: LogicsinfoType[];
  userlogics: LogicsinfoType[];
  systemlogics: LogicsinfoType[];
  newlogics: LogicsinfoType[];
  constructor(private http: HttpClient, private dataService: LogicsApiService, private modalService: BsModalService) {
    this.userlogics = [];
    this.systemlogics = [];
  }

  ngOnInit() {
    console.log('LogicsListComponent.ngOnInit');

    this.dataService.getLogics()
      .subscribe(
        (response) => {
            this.logics = <LogicsinfoType[]>response['logics'];
            this.logics.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
            for (const logic of this.logics) {
              if (logic.userlogic === true) {
                this.userlogics.push(logic);
              } else {
                this.systemlogics.push(logic);
              }
            }
            this.newlogics = <LogicsinfoType[]>response['logics_new'];
            this.newlogics.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
        }
      );
  }
}
