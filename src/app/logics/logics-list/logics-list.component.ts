
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

  newlogic_display: boolean = false;
  newlogic_name: string = '';
  newlogic_filename: string = '';
  newlogic_add_enabled: boolean = true;

  confirmdelete_display: boolean = false;
  logicToDelete: string = '';
  delete_param: {};


  constructor(private http: HttpClient, private dataService: LogicsApiService, private modalService: BsModalService) {
    this.userlogics = [];
    this.systemlogics = [];
  }


  ngOnInit() {
    console.log('LogicsListComponent.ngOnInit');
    this.getLogics();
/*
    this.dataService.getLogics()
      .subscribe(
        (response) => {
            this.logics = <LogicsinfoType[]>response['logics'];
            this.logics.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
            this.userlogics = [];
            this.systemlogics = [];
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
*/
  }


  baseName(str, withExtension = true) {
    let base = str;
    base = base.substring(base.lastIndexOf('/') + 1);
    if (!withExtension && base.lastIndexOf('.') !== -1) {
      base = base.substring(0, base.lastIndexOf('.'));
    }
    return base;
  }


  getLogics() {
    this.dataService.getLogics()
      .subscribe(
        (response) => {
          this.logics = <LogicsinfoType[]>response['logics'];
          this.logics.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
          this.userlogics = [];
          this.systemlogics = [];
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


  triggerLogic(logicName) {
    console.log('triggerLogic', {logicName});
    this.dataService.setLogicState(logicName, 'trigger');
  }


  reloadLogic(logicName) {
    console.log('reloadLogic', {logicName});
    this.dataService.setLogicState(logicName, 'reload');
    this.getLogics();
  }


  disableLogic(logicName) {
    console.log('disableLogic', {logicName});
    this.dataService.setLogicState(logicName, 'disable');
    this.getLogics();
  }


  enableLogic(logicName) {
    console.log('enableLogic', {logicName});
    this.dataService.setLogicState(logicName, 'enable');
    this.getLogics();
  }


  unloadLogic(logicName) {
    console.log('unloadLogic', {logicName});
    this.dataService.setLogicState(logicName, 'unload');
    this.getLogics();
  }


  loadLogic(logicName) {
    console.log('loadLogic', {logicName});
    this.dataService.setLogicState(logicName, 'load');
    this.getLogics();
  }


  newLogic() {
    console.log('newLogic');
    this.newlogic_name = '';
    this.newlogic_filename = '';
    this.newlogic_add_enabled = false;
    this.newlogic_display = true;
  }


  checkNewLogicInput() {
    this.newlogic_add_enabled = true;
    if (this.newlogic_name === '' || this.newlogic_filename === '') {
      this.newlogic_add_enabled = false;
      return;
    }

    for (let i = 0; i < this.logics.length; i++) {
      // console.log({i}, this.logics[i].name);
      if (this.newlogic_name === this.logics[i].name) {
        this.newlogic_add_enabled = false;
      }
    }

    for (let i = 0; i < this.logics.length; i++) {
      // console.log({i}, this.baseName(this.logics[i].pathname, false));
      if (this.newlogic_filename === this.baseName(this.logics[i].pathname, false)) {
        this.newlogic_add_enabled = false;
      }
    }
  }


  createLogic() {
    console.warn('createLogic', this.newlogic_name, this.newlogic_filename);
    this.newlogic_display = false;
  }



  deleteLogic(logicName) {
    console.log('deleteLogic', {logicName});

    this.logicToDelete = logicName;
    this.delete_param = {'config': this.logicToDelete};
    this.confirmdelete_display = true;
  }


  deleteLogicConfirm() {
    console.log('deleteLogicConfirm', this.logicToDelete);

    this.confirmdelete_display = false;
    this.dataService.deleteLogic(this.logicToDelete);
    this.getLogics();
  }


  deleteLogicAbort() {
    this.confirmdelete_display = false;
    this.logicToDelete = '';
  }
}

