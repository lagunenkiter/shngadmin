
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OlddataService } from '../common/services/olddata.service';

import {SchedulersApiService} from '../common/services/schedulers-api.service';
import {ServerDataService} from '../common/services/server-data.service';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  providers: []
})

export class ServicesComponent implements OnInit {

//  schedulerinfo: SchedulerInfo[];

  constructor(private http: HttpClient,
              private dataService: SchedulersApiService,
              private dataServiceServer: ServerDataService) {
  }

  ngOnInit() {
    console.log('ServicesComponent.ngOnInit');

    this.dataService.getSchedulers()
      .subscribe(
        (response) => {
//          this.schedulerinfo = <SchedulerInfo[]>response;
//          this.schedulerinfo.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)});
          console.log('getSchedulers', {response});
        }
      );

  }


  restartShng() {
    this.dataServiceServer.restartShngServer()
      .subscribe(
        (response) => {
          const res = <any> response;
          console.log('restartShng', res.result);
        }
      );
  }
}
