import {Component, OnInit, AfterViewChecked, ViewChild} from '@angular/core';
import {FilesApiService} from '../../common/services/files-api.service';
import {ServerInfo} from '../../common/models/server-info';
import {ServicesApiService} from '../../common/services/services-api.service';

@Component({
  selector: 'app-logging-configuration',
  templateUrl: './logging-configuration.component.html',
  styleUrls: ['./logging-configuration.component.css']
})
export class LoggingConfigurationComponent implements AfterViewChecked, OnInit {

  constructor(private fileService: FilesApiService,
              private dataService: ServicesApiService) { }

  // -----------------------------------------------------------------
  //  Vars for the codemirror components
  //
  rulers = [];

  // -----------------------------------------------------
  //  Vars for the YAML syntax checker
  //
  @ViewChild('codeeditor') private codeEditor;

  myTextarea = '';
  myTextareaOrig = '';
  cmOptions = {
    lineNumbers: true,
    readOnly: false,
    indentUnit: 4,
    lineSeparator: '\n',
    rulers: this.rulers,
    mode: 'yaml',
    lineWrapping: false,
    firstLineNumber: 1,
    indentWithTabs: false,
    autorefresh: true,
    fixedGutter: true,
  };

  error_display = false;
  myTextOutput = '';


  ngOnInit() {
    // console.log('LoggingConfigurationComponent.ngOnInit');

    for (let i = 1; i <= 100; i++) {
      this.rulers.push({color: '#eee', column: i * 4, lineStyle: 'dashed'});
    }

    this.fileService.readFile('logging')
      .subscribe(
        (response) => {
          this.myTextarea = response;
          this.myTextareaOrig = response;
        }
      );


  }


  ngAfterViewChecked() {

    const editor1 = this.codeEditor.codeMirror;
    editor1.setSize('100%', '78vh');
    editor1.refresh();
  }


  saveConfig() {
    // console.log('LoggingConfigurationComponent.saveConfig');

    this.dataService.CheckYamlText(this.myTextarea)
      .subscribe(
        (response) => {
          this.myTextOutput = <any> response;
          if (this.myTextOutput.startsWith('ERROR:')) {
            this.error_display = true;
          } else {
            this.fileService.saveFile('logging', this.myTextarea)
              .subscribe(
                (response2) => {
                  this.myTextareaOrig = this.myTextarea;
                }
              );

          }
          const editor = this.codeEditor.codeMirror;
          editor.refresh();
        }
      );

  }

}
