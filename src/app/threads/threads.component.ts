
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

import { ThreadinfoType } from '../interfaces';


@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css'],
  providers: [DataService]
})


export class ThreadsComponent implements OnInit {

  threadsList: ThreadinfoType[];
  threads_count: number;
  thread_response: [number, ThreadinfoType[]];


  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    console.log('ngOnInit ThreadsComponent');

    this.dataService.getThreadinfo()
      .subscribe(
        (response: [number, ThreadinfoType[]]) => {
          console.log('getThreadinfo:');
          console.log(response);
          this.threadsList = response[1];
          this.threads_count = response[0];
//          this.schedulerinfo.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)});
        },
        (error) => {
          console.log('ERROR: ThreadsComponent: dataService.getThreadinfo():');
          console.log(error)
        }
      );
  }
}

