
import {Component, OnInit, AfterViewChecked, ViewChild} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {SelectItem} from 'primeng/api';

import {FilesApiService} from '../../common/services/files-api.service';
import {ServerInfo} from '../../common/models/server-info';
import {ServicesApiService} from '../../common/services/services-api.service';


@Component({
  selector: 'app-item-configuration',
  templateUrl: './item-configuration.component.html',
  styleUrls: ['./item-configuration.component.css']
})
export class ItemConfigurationComponent implements AfterViewChecked, OnInit {

  constructor(private translate: TranslateService,
              private fileService: FilesApiService,
              private dataService: ServicesApiService) { }

  // -----------------------------------------------------------------
  //  Vars for the codemirror components
  //
  rulers = [];

  // -----------------------------------------------------
  //  Vars for the YAML syntax checker
  //
  @ViewChild('codeeditor') private codeEditor;

  filelist: string[];
  itemFiles: SelectItem[];
  selectedItemfile: SelectItem;


  myEditFilename = '';
  myTextarea = '';
  myTextareaOrig = '';

  cmOptions = {
    indentWithTabs: false,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {
      'Tab': 'insertSoftTab',
      'Shift-Tab': 'indentLess',
      'F11': function(cm) {
        cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        // cm.getScrollerElement().style.maxHeight = 'none';
      },
      'Esc': function(cm, fullScreen) {
        if (cm.getOption('fullScreen')) {
          cm.setOption('fullScreen', false);
        }
      },
      'Ctrl-Q': function(cm) {
        cm.foldCode(cm.getCursor());
      },
      'Shift-Ctrl-Q': function(cm) {
        for (let l = cm.firstLine(); l <= cm.lastLine(); ++l) {
          cm.foldCode({line: l, ch: 0}, null, 'unfold');
        }
      }
    },
    fullScreen: false,
    lineNumbers: true,
    readOnly: false,
    lineSeparator: '\n',
    rulers: this.rulers,
    mode: 'yaml',
    lineWrapping: false,
    firstLineNumber: 1,
    autorefresh: true,
    fixedGutter: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  };

  editorHelp_display = false;
  error_display = false;
  myTextOutput = '';
  newconfig_display = false;
  newFilename = '';
  add_enabled = false;

  confirmdelete_display: boolean = false;
  delete_param: {};

  ngOnInit() {
    // console.log('LoggingConfigurationComponent.ngOnInit');

    for (let i = 1; i <= 100; i++) {
      this.rulers.push({color: '#eee', column: i * 4, lineStyle: 'dashed'});
    }
    this.getItemFile('');

    this.itemFiles = [];
    this.fileService.getfileList('items')
      .subscribe(
        (response) => {
          this.filelist = <string[]> response;
          for (let i = 0; i < this.filelist.length; i++) {
            //
            // I get it. The sample code here and in the docs is wrong, it should read like this:
            //
            // fails
            //   this.cities.push({name:'New York', code: 'NY'});
            //
            // correct
            //   this.cities = [...this.cities, {name:'New York', code: 'NY'}];
            //
            this.itemFiles = [...this.itemFiles, <SelectItem> {'label': this.filelist[i], 'value': this.filelist[i]}];
          }
        }
      );

    // this.getItemFile('q21_09Bad');


  }


  ngAfterViewChecked() {

    const editor1 = this.codeEditor.codeMirror;
    if (editor1.getOption('fullScreen')) {
      editor1.setSize('100vw', '100vh');
    } else {
      editor1.setSize('70vw', '78vh');
    }
    editor1.refresh();
  }


  newConfig() {
    this.newFilename = '';
    this.newconfig_display = true;
  }


  deleteConfig() {
    this.delete_param = {'config': this.myEditFilename};
    this.confirmdelete_display = true;
  }


  DeleteConfigConfirm() {
    // console.log('ItemConfigurationComponent.DeleteConfigConfirm:');

    // close confirm dialog
    this.confirmdelete_display = false;

    // delete on backend server
    this.fileService.deleteFile('items', this.myEditFilename)
      .subscribe(
        (response: any) => {
          if (response) {
            // close configuration dialog
            this.confirmdelete_display = false;
            console.log('ItemConfigurationComponent.DeleteConfigConfirm(): call ngOnInit()');
            this.ngOnInit();
//            this.restart_core_button = true;

          }
        }
      );

    // alert('code for removal of plugin "' + this.dialog_configname + '" configurations is not yet implemented');


    return true;
  }


  checkInput() {
    this.add_enabled = false;
    if (this.newFilename.length > 0) {
      this.add_enabled = true;
      for (const filenno in this.filelist) {
        const fn = this.filelist[filenno].slice(0, -5);
        if (this.newFilename === fn) {
          this.add_enabled = false;
        }
      }

    }
  }


  addFile() {
    this.newconfig_display = false;

    this.myTextarea = '# ' + this.newFilename + '.yaml\n';
    this.myTextareaOrig = this.myTextarea;
    this.myEditFilename = this.newFilename;
    this.cmOptions.readOnly = false;

    this.fileService.saveFile('items', this.myEditFilename, this.myTextarea)
      .subscribe(
        (response2) => {
          this.myTextareaOrig = this.myTextarea;

          this.itemFiles = [];
          this.fileService.getfileList('items')
            .subscribe(
              (response) => {
                this.filelist = <string[]> response;
                for (let i = 0; i < this.filelist.length; i++) {
                  this.itemFiles = [...this.itemFiles, <SelectItem> {'label': this.filelist[i], 'value': this.filelist[i]}];
                }
              }
            );
        }
      );
  }



  itemFileSelected() {
    let filename = this.selectedItemfile.value;
    if (filename.toLowerCase().endsWith('.yaml')) {
      filename = filename.slice(0, -5)
      // console.log('itemFileSelected()' , {filename});
      this.getItemFile(filename);
    } else {
      this.myEditFilename = '';
      this.myTextarea = '';
      this.cmOptions.readOnly = true;
      this.myTextarea = this.translate.instant('ITEM_CONFIG.FILETYPE_UNSUPPORTED');
    }
  }


  getItemFile(filename) {
    this.myEditFilename = '';
    this.myTextarea = '';
    this.cmOptions.readOnly = true;
    if (filename === '') {
      return;
    }

    this.fileService.readFile('items', filename)
      .subscribe(
        (response) => {
          this.myTextarea = response;
          this.myTextareaOrig = response;
          if (this.myTextarea === '') {
            this.myTextarea = this.translate.instant('ITEM_CONFIG.FILE_NOT_FOUND');
          } else {
            this.myEditFilename = filename;
            this.cmOptions.readOnly = false;
          }
        }
      );
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
            this.fileService.saveFile('items', this.myEditFilename, this.myTextarea)
              .subscribe(
                (response2) => {
                  this.myTextareaOrig = this.myTextarea;
                }
              );

          }
          if (this.codeEditor !== undefined) {
            const editor = this.codeEditor.codeMirror;
            editor.refresh();
          }
        }
      );

  }

}
