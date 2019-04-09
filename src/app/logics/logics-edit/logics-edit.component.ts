
import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilesApiService} from '../../common/services/files-api.service';
import * as CodeMirror from 'codemirror';

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
  dict: {}[] = [];
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
      'Ctrl-Space': 'autocomplete',
      'Ctrl-I': 'autocomplete_item',
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
    this.getPluginDictionary();
    this.registerAutocompleteHelper('autocompleteHint', this.dict);
    // @ts-ignore
    console.log(CodeMirror.hint.autocompleteHint);
    // @ts-ignore
    CodeMirror.commands.autocomplete_shng = function(cm) {
      // @ts-ignore
      CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
    };
  }


  registerAutocompleteHelper(name, curDict) {
    CodeMirror.registerHelper('hint', 'autocompleteHint', function(editor) {
      const cur = editor.getCursor();
      const curLine = editor.getLine(cur.line);
      let start = cur.ch;
      let end = start;

      const charexp =  /[\w\.$]+/;
      while (end < curLine.length && charexp.test(curLine.charAt(end))) {
        end++;
      }
      while (start && charexp.test(curLine.charAt(start - 1))) {
        start--;
      }
      let curWord = start !== end && curLine.slice(start, end);
      if (curWord.length > 1) {
        curWord = curWord.trim();
      }
      const regex = new RegExp('^' + curWord, 'i');
      if (curWord.length >= 3) {
        const oCompletions = {
          list: (!curWord ? [] : curDict.filter(function (item) {
            return item['displayText'].match(regex);
          })).sort(function(a, b) {
            const nameA = a.text.toLowerCase();
            const nameB = b.text.toLowerCase();
            if (nameA < nameB) { // sort string ascending
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0; // default return value (no sorting)
          }),
          from: CodeMirror.Pos(cur.line, start),
          to: CodeMirror.Pos(cur.line, end)
        };

        return oCompletions;
      }
    });
    // @ts-ignore
    console.warn('registerAutocompleteHelper: CodeMirror.hint', CodeMirror.hint.autocompleteHint);
  }

  getPluginDictionary() {
    this.dict.push({ text: 'test', displayText: 'test'}, {text: 'test2', displayText: 'test2'});
  }

  ngAfterViewChecked() {
    const editor1 = this.codeEditor.codeMirror;
    if (editor1.getOption('fullScreen')) {
      editor1.setSize('100vw', '100vh');
    } else {
      editor1.setSize('93vw', '74vh');
    }
    editor1.refresh();
    editor1.on('keyup', function (cm, event) {
      if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
        (event.keyCode !== 8 &&
          event.keyCode !== 9 &&
          event.keyCode !== 13 &&
          event.keyCode !== 27 &&
          event.keyCode !== 37 &&
          event.keyCode !== 38 &&
          event.keyCode !== 39 &&
          event.keyCode !== 40 &&
          event.keyCode !== 46)) {
            // @ts-ignore
            CodeMirror.commands.autocomplete_shng(cm, null, {completeSingle: false});
          }
    });
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
