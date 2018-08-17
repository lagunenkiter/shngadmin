
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

import { SchedulerType } from '../interfaces';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  providers: [DataService]
})

export class ServicesComponent implements OnInit {

  schedulerinfo: SchedulerType[];

  constructor(private http: HttpClient, private dataService: DataService) {
  }

  ngOnInit() {
    console.log('ngOnInit ServicesComponent');

    this.dataService.getSchedulerinfo()
      .subscribe(
        (response: SchedulerType[]) => {
          console.log('getSchedulerinfo:');
          console.log(response);
          this.schedulerinfo = response;
          this.schedulerinfo.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)});
        },
        (error) => {
          console.log('ERROR: ServicesComponent: dataService.getSchedulerinfo():');
          console.log(error)
        }
      );
  }
}
