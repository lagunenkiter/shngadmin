
import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';


import { TreeNode } from '../common/models/interfaces';
import { ScenesApiService } from '../common/services/scenes-api.service';
import {PlugininfoType} from '../common/models/plugin-info';
import {SystemInfo} from '../common/models/system-info';
import {SceneInfo} from '../common/models/scene-info';




@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.css'],
  providers: [MessageService]
})
export class ScenesComponent implements OnInit {


  sceneList: SceneInfo[];

  systeminfo: SystemInfo = <SystemInfo>{};


  constructor(private http: HttpClient,
              private translate: TranslateService,
              private messageService: MessageService,
              private dataService: ScenesApiService) { }


  ngOnInit() {
    console.log('ScenesComponent.ngOnInit');

    this.dataService.getScenes()
      .subscribe(
        (response) => {
          this.sceneList = <SceneInfo[]>response;
//          this.schedulerinfo.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)});
          console.log('getScenes', {response});
        }
      );
  }

}
