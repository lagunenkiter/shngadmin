
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { LogsType, LogsInfoDict } from '../common/models/logfiles-info';
import { LogsApiService } from '../common/services/logs-api.service';
import { TranslateService } from '@ngx-translate/core';

import * as CodeMirror from 'codemirror';

interface DropDownEntry {
  label: string;
  value: string;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
//  styles: ['.CodeMirror { width: 100%; height: 50vh; }' ],
  encapsulation: ViewEncapsulation.None
})
export class LogsComponent implements OnInit {

  logs_info: LogsInfoDict = {};
  default_log = '';

  logs: DropDownEntry[] = [];
  selectedLog: string = null;

  files: DropDownEntry[] = [];
  selectedFile: string = null;

  displayLogfile = '';
  text_filter = '';

  logfile_content = '';

  cmOptions = {
    lineNumbers: true,
    readOnly: true,
    indentUnit: 4,
    lineSeparator: '\n',
    mode: 'ttcn',
    lineWrapping: false,
//    firstLineNumber: firstLineNumber,
    indentWithTabs: false
  };


  constructor(private dataService: LogsApiService,
              private translate: TranslateService) {
    // this.logfile = 'smarthome-warnings.log';
  }


  ngOnInit() {
    console.log('LogsComponent.ngOnInit');

    this.dataService.getLogs()
      .subscribe(
        (response: LogsType) => {
          this.logs_info = response['logs'];
          this.default_log = response['default'];
          this.logs = [];
          for (let log in this.logs_info) {
            if (this.logs_info.hasOwnProperty(log)) {
              this.logs.push({label: log, value: log});
            }
          }
          this.selectedLog = null;
          if (this.default_log in this.logs_info) {
            this.selectedLog = this.default_log;
            this.fillTimeframe(true);
          }
          // this.selectedFile = this.translate.instant('LOGS.ACTUAL');
          console.log('getLogs', {response});
        }
      );
  }

  fillTimeframe(useActual = false) {
    if (this.selectedLog === null) {
      this.files = [];
      this.selectedFile = null;
      this.readLogfile();
    } else {
      this.files = [];
      console.log('selectedLog:', this.selectedLog);

      this.logs_info[this.selectedLog].sort();
      this.logs_info[this.selectedLog].push(this.logs_info[this.selectedLog][0]);
      this.logs_info[this.selectedLog].splice(0, 1);
      this.logs_info[this.selectedLog].reverse();

      for (let i = 0; i < (this.logs_info[this.selectedLog]).length; i++) {
          let tf = this.logs_info[this.selectedLog][i];
          tf = tf.substr(String(this.selectedLog).length + 4);
          if (tf === '') {
            tf = '.' + this.translate.instant('LOGS.ACTUAL');
          }
          const wrk = {label: tf.substr(1), value: this.logs_info[this.selectedLog][i]};
        this.files.push(wrk);
      }

      if (this.files.length === 1 || useActual) {
        this.selectedFile = this.files[0].value;
        this.readLogfile();
      } else {
        this.selectedFile = null;
        this.readLogfile();
      }
    }
    console.log('files: ', this.files);
    console.log('selectedFile: ', this.selectedFile);
  }


  changedTimeframe() {
    if (this.selectedFile === null) {
      this.readLogfile();
    } else {
      this.readLogfile();
    }
  }


  readLogfile() {
    console.log('selectedFile:', this.selectedFile);
    if (this.selectedLog === null || this.selectedFile === null) {
      this.displayLogfile = '';
      this.logfile_content = '';
    } else {
      this.displayLogfile = String(this.selectedFile);

      this.dataService.readLogfile(this.displayLogfile)
        .subscribe(
          (response: string) => {
            console.log({response});
            this.logfile_content = response;
          }
        );
    }
    console.log('displayLogfile: ', this.displayLogfile);
  }

  // -------------------------------------------------------------



/*
    window.addEventListener("resize", function(){resizeCodeMirror(logCodeMirror, 75)}, false);
    resizeCodeMirror(logCodeMirror, 75);

    $('#linewrapping').click(function(e) {
      switchLineWrapping(logCodeMirror)
    });

    {% if current_page <= 1 %}$('#fast-backward').prop('disabled', true);$('#step-backward').prop('disabled', true);{% endif %}
    {% if current_page >= pages %}$('#fast-forward').prop('disabled', true);$('#step-forward').prop('disabled', true);{% endif %}
*/

}

