
import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService} from 'ngx-bootstrap/modal';

import {LogicsApiService} from '../common/services/logics-api.service';
import {LogicsinfoType} from '../common/models/logics-info';
import {OlddataService} from '../common/services/olddata.service';

@Component({
  selector: 'app-logics',
  templateUrl: './logics.component.html',
  styleUrls: ['./logics.component.css'],
  providers: [OlddataService]
})
export class LogicsComponent implements OnInit {

  logicsinfo: LogicsinfoType[];
  constructor(private http: HttpClient, private dataService: LogicsApiService, private modalService: BsModalService) {
  }

  ngOnInit() {
    console.log('LogicsComponent.ngOnInit');

    this.dataService.getLogics()
      .subscribe(
        (response) => {
            this.logicsinfo = <LogicsinfoType[]>response['logics'];
            this.logicsinfo.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
            console.log(this.logicsinfo);
        }
      );
  }
}
