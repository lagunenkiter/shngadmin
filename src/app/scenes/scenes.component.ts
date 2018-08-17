
import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';


import {PlugininfoType, SceneinfoType, SysteminfoType, TreeNode} from '../interfaces';
import { DataService } from '../data.service';


export interface Car {
  vin?;
  year?;
  brand?;
  color?;
  price?;
  saleDate?;
}

export class PrimeCar implements Car {
  constructor(public vin?, public year?, public brand?, public color?) {}
}


@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.css'],
  providers: [MessageService]
})
export class ScenesComponent implements OnInit {


  sceneList: SceneinfoType[];

  systeminfo: SysteminfoType = <SysteminfoType>{};

  /* ----- */


  files1: TreeNode[];

  files2: TreeNode[];

  cols: any[];
  carcols: any[];

  /* ----- */

  car: Car = new PrimeCar();

  selectedCar: Car;

  newCar: boolean;

  cars: Car[];




  constructor(private http: HttpClient,
              private translate: TranslateService,
              private messageService: MessageService,
              private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getSysteminfo()
      .subscribe(
        (response: SysteminfoType) => {
          console.log('getSysteminfo:');
          console.log(response);
          this.systeminfo = response;
          },
        (error) => {
          console.log('SystemComponent: dataService.getSysteminfo():');
          console.log(error);
        }
      );


    this.dataService.getSceneinfo()
      .subscribe(
        (response: SceneinfoType[]) => {
          console.log('SceneComponent:');
          console.log(response);
          this.sceneList = response;
//          this.plugininfo.sort(function (a, b) {return (a.pluginname + a.configname.toLowerCase() > b.pluginname + b.configname.toLowerCase()) ? 1 : ((b.pluginname + b.configname.toLowerCase() > a.pluginname + a.configname.toLowerCase()) ? -1 : 0)});
        },
        (error) => {
          console.log('ERROR: SceneComponent: dataService.getSceneinfo():');
          console.log(error)
        }
      );

  }


}
