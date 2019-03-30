
import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilesApiService} from '../../common/services/files-api.service';

@Component({
  selector: 'app-logics-edit',
  templateUrl: './logics-edit.component.html',
  styleUrls: ['./logics-edit.component.css']
})
export class LogicsEditComponent implements AfterViewChecked, OnInit {


  constructor(private route: ActivatedRoute,
              private fileService: FilesApiService) { }


  // -----------------------------------------------------------------
  //  Vars for the codemirror components
  //
  rulers = [];

  // -----------------------------------------------------
  //  Vars for the YAML syntax checker
  //
  @ViewChild('codeeditor') private codeEditor;

  myEditFilename: string;
  myTextarea = '';
  myTextareaOrig = '';
  cmOptions = {
    indentWithTabs: false,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {
      'F1': function(cm) {
        this.editorHelp_display = true;
      },
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
    mode: 'python',
    lineWrapping: false,
    firstLineNumber: 1,
    autorefresh: true,
    fixedGutter: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  };

  editorHelp_display = false;
  error_display = false;


  ngOnInit() {

    let logicName = this.route.snapshot.paramMap['params']['logicname'];
    if (logicName !== undefined) {
      if (logicName.endsWith('.log')) {
        logicName = logicName.slice(0, -4);
      }
    }
    this.myEditFilename = logicName;

    for (let i = 1; i <= 100; i++) {
      this.rulers.push({color: '#eee', column: i * 4, lineStyle: 'dashed'});
    }

    this.fileService.readFile('logics', this.myEditFilename)
      .subscribe(
        (response) => {
          this.myTextarea = response;
          console.log('ngOnInit', 'read', {response});
          const editor = this.codeEditor.codeMirror;
          editor.setOption('lineSeparator', '\n');
          if (this.myTextarea.indexOf('\r\n') >= 0) {
            editor.setOption('lineSeparator', '\r\n');
          }
          this.myTextareaOrig = this.myTextarea;
        }
      );

  }

  ngAfterViewChecked() {

    const editor1 = this.codeEditor.codeMirror;
    if (editor1.getOption('fullScreen')) {
      editor1.setSize('100vw', '100vh');
    } else {
      editor1.setSize('93vw', '74vh');
    }
    editor1.refresh();
  }


  saveConfig() {
    // console.log('LoggingConfigurationComponent.saveConfig');

    this.fileService.saveFile('logics', this.myEditFilename, this.myTextarea)
      .subscribe(
        (response) => {
          this.myTextareaOrig = this.myTextarea;
        }
      );

    const editor = this.codeEditor.codeMirror;
    editor.refresh();
  }

}
