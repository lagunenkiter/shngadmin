
import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';

import { DataService } from '../data.service';
import { SchedulerType } from '../interfaces';
import { PlugininfoType } from '../interfaces';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.css'],
  providers: [DataService]
})
export class PluginsComponent implements OnInit {

  faPlayCircle = faPlayCircle;
  faPauseCircle = faPauseCircle;

  plugininfo: PlugininfoType[];

  modalRef: BsModalRef;
  constructor(private http: HttpClient, private dataService: DataService, private modalService: BsModalService) {
  }

  ngOnInit() {
    console.log('ngOnInit PluginsComponent');

    this.dataService.getPlugininfo()
      .subscribe(
        (response: PlugininfoType[]) => {
          console.log('PluginsComponent:');
          console.log(response);
          this.plugininfo = response;
          // this.plugininfo.sort(function (a, b) {return (a.pluginname > b.pluginname) ? 1 : ((b.pluginname > a.pluginname) ? -1 : 0)});
          // this.plugininfo.sort(function (a, b) {return (a.configname.toLowerCase() > b.configname.toLowerCase()) ? 1 : ((b.configname.toLowerCase() > a.configname.toLowerCase()) ? -1 : 0)});
          this.plugininfo.sort(function (a, b) {return (a.pluginname + a.configname.toLowerCase() > b.pluginname + b.configname.toLowerCase()) ? 1 : ((b.pluginname + b.configname.toLowerCase() > a.pluginname + a.configname.toLowerCase()) ? -1 : 0)});
          // for (const pi in this.plugininfo) {
          //   this.plugininfo[pi].metadata.description_long = this.plugininfo[pi].metadata.description_long.split("\n").join("\<br\>");
          // }
        },
        (error) => {
          console.log('ERROR: PluginsComponent: dataService.getPlugininfo():');
          console.log(error)
        }
      );
  }

  parameterLines(parameters) {
    let result = Math.round(parameters / 2);
    if (result < 3) {
      result = 3;
    }
    return result;
  }

  attributeLines(parameters) {
    let result = Math.round(parameters / 3);
    if (result < 2) {
      result = 2;
    }
    return result;
  }

  openModal(template: TemplateRef<any>, parm: string) {
    this.modalRef = this.modalService.show(template, {animated: false});
    console.log('openModal: ' + parm);
  }
}

