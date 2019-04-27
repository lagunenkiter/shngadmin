
import {AfterViewChecked, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, convertToParamMap} from '@angular/router';

import { LogsType, LogsInfoDict } from '../../common/models/logfiles-info';
import { LogsApiService } from '../../common/services/logs-api.service';
import { TranslateService } from '@ngx-translate/core';

import {$NBSP} from 'codelyzer/angular/styles/chars';

interface DropDownEntry {
  label: string;
  value: string;
}

@Component({
  selector: 'app-logs',
  templateUrl: './log-display.component.html',
  styleUrls: ['./log-display.component.css'],
//  styles: ['.CodeMirror { width: 100%; height: 50vh; }' ],
  encapsulation: ViewEncapsulation.None
})
export class LogDisplayComponent implements AfterViewChecked, OnInit {

  @ViewChild('codeeditor') private codeEditor;

  loglevels: DropDownEntry[] = [];

  logs_info: LogsInfoDict = {};
  default_log = '';

  logs: DropDownEntry[] = [];
  selectedLog: string = null;

  files: DropDownEntry[] = [];
  selectedFile: string = null;

  displayLogfile = '';
  text_filter = '';
  level_filter = 'ALL';

  nbsp = String.fromCharCode(160);

  logfile_chunk = {};
  first_chunk = true;
  last_chunk = true;
  chunk_no = 1;
  logfile_content = '';

  cmOptions = {
    indentWithTabs: false,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {
      'F11': function(cm) {
        cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        // cm.getScrollerElement().style.maxHeight = 'none';
      },
      'Ctrl-L': function(cm) {
        cm.setOption('lineWrapping', !cm.getOption('lineWrapping'));
      },
      'Esc': function(cm, fullScreen) {
        if (cm.getOption('fullScreen')) {
          cm.setOption('fullScreen', false);
        }
      }
    },
    fullScreen: false,
    lineNumbers: true,
    readOnly: true,
    lineSeparator: '\n',
    // rulers: this.rulers,
    mode: 'ttcn',
    lineWrapping: false,
    firstLineNumber: 1,
    autorefresh: true,
    fixedGutter: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  };

  editorHelp_display = false;
  spinner_display: boolean = false;


  constructor(private route: ActivatedRoute,
              private dataService: LogsApiService,
              private translate: TranslateService) {
  }


  ngOnInit() {
    // console.log('LogDisplayComponent.ngOnInit');

    // test if component is called with a parameter and remove '.log' from the parameter
    let logParam = this.route.snapshot.paramMap['params']['logname'];
    if (logParam !== undefined) {
      if (logParam.endsWith('.log')) {
        logParam = logParam.slice(0, -4);
      }
    }
    console.log({logParam});

    this.loglevels.push({label: 'ALL', value: 'ALL'});
    this.loglevels.push({label: 'DEBUG', value: ' DEBUG '});
    this.loglevels.push({label: 'INFO', value: ' INFO '});
    this.loglevels.push({label: 'WARNING', value: ' WARNING '});
    this.loglevels.push({label: 'ERROR', value: ' ERROR '});
    this.loglevels.push({label: 'CRITICAL', value: ' CRITICAL '});

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
          if (logParam !== undefined) {
            if (logParam in this.logs_info) {
              this.selectedLog = logParam;
              this.fillTimeframe(true);
            }
          }
          if (this.selectedLog == null && this.default_log in this.logs_info) {
            this.selectedLog = this.default_log;
            this.fillTimeframe(true);
          }
          // this.selectedFile = this.translate.instant('LOGS.ACTUAL');
          // console.log('getLogs', {response});
        }
      );
  }


  ngAfterViewChecked() {

    const editor1 = this.codeEditor.codeMirror;
    if (editor1.getOption('fullScreen')) {
      editor1.setSize('100vw', '100vh');
    } else {
      editor1.setSize('97vw', '86vh');
    }
    editor1.refresh();
  }



  fillTimeframe(useActual = false) {
    if (this.selectedLog === null) {
      this.files = [];
      this.selectedFile = null;
      this.readLogfile();
    } else {
      this.files = [];
      // console.log('selectedLog:', this.selectedLog);

      this.logs_info[this.selectedLog].sort();
      this.logs_info[this.selectedLog].push(this.logs_info[this.selectedLog][0]);
      this.logs_info[this.selectedLog].splice(0, 1);
      this.logs_info[this.selectedLog].reverse();

      for (let i = 0; i < (this.logs_info[this.selectedLog]).length; i++) {
          let tf = this.logs_info[this.selectedLog][i][0];
          let tfsize = this.logs_info[this.selectedLog][i][1];
          let tfunit = 'KB';
          tf = tf.substr(String(this.selectedLog).length + 4);
          if (tf === '') {
            tf = '.' + this.translate.instant('LOGS.ACTUAL');
          }
          if (Number(tfsize) > 1024) {
            tfsize = (Number(tfsize) / 1024).toFixed(1);
            tfunit = 'MB';
          }
          const wrk = {label: tf.substr(1) + ' (' + tfsize + tfunit + ')', value: this.logs_info[this.selectedLog][i][0]};
        this.files.push(wrk);
      }

      if (this.files.length === 1 || useActual) {
        this.selectedFile = this.files[0].value;
        this.readLogfile();
      } else {
        // use other preset?
        this.selectedFile = this.files[0].value;
        this.readLogfile();
      }
    }
    // console.log('files: ', this.files);
    // console.log('selectedFile: ', this.selectedFile);
  }


  changedTimeframe() {
    if (this.selectedFile === null) {
      this.readLogfile();
    } else {
      this.readLogfile();
    }
  }


  filterLogChunk() {
    this.logfile_content = this.logfile_chunk['loglines'].join('');
    this.logfile_content = '';
    this.cmOptions.lineNumbers = ((this.level_filter === 'ALL') && (this.text_filter === ''));

    // const filter = this.text_filter.replace(/ /g, this.nbsp);
    const filter = this.text_filter;
    for (let i = 0; i < this.logfile_chunk['loglines'].length; i++) {
      if (this.level_filter === 'ALL' || this.logfile_chunk['loglines'][i].indexOf(this.level_filter) > -1) {
        if (filter === '' || this.logfile_chunk['loglines'][i].indexOf(filter) > -1) {
          this.logfile_content += this.logfile_chunk['loglines'][i];
        }
      }
    }
  }

  scrollDown() {
    this.codeEditor.codeMirror.execCommand('goDocEnd');
  }

  readLogfile(chunk = 1) {
    // console.log('selectedFile:', this.selectedFile);
    if (this.selectedLog === null || this.selectedFile === null) {
      this.displayLogfile = '';
      this.logfile_content = '';
    } else {
      this.spinner_display = true;
      this.displayLogfile = String(this.selectedFile);

      this.dataService.readLogfile(this.displayLogfile, chunk)
        .subscribe(
          (response: string) => {
            // console.log({response});
            this.logfile_chunk = <any> response;
            this.first_chunk = (this.logfile_chunk['lines'][0] === 1);
            this.last_chunk = this.logfile_chunk['lastchunk'];
            this.chunk_no = this.logfile_chunk['chunk'];
            this.cmOptions.lineNumbers = true;
            this.cmOptions.firstLineNumber = this.logfile_chunk['lines'][0];
            if (this.cmOptions.firstLineNumber !== undefined) {
              for (let i = 0; i < this.logfile_chunk['loglines'].length; i++) {
                let wrk2 = '';
                for (let c = 0; c < this.logfile_chunk['loglines'][i].length; c++) {
                  if (this.logfile_chunk['loglines'][i][c].charCodeAt(0) === 160) {
                    wrk2 += ' ';
                  } else {
                    wrk2 += this.logfile_chunk['loglines'][i][c];
                  }
                }
                this.logfile_chunk['loglines'][i] = wrk2;
              }
            }

            this.filterLogChunk();
            this.spinner_display = false;
          }
        );
    }
    // console.log('displayLogfile: ', this.displayLogfile);
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

