
import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilesApiService} from '../../common/services/files-api.service';
import * as CodeMirror from 'codemirror';
import {PluginsApiService} from '../../common/services/plugins-api.service';
import {ItemsApiService} from '../../common/services/items-api.service';

@Component({
  selector: 'app-logics-edit',
  templateUrl: './logics-edit.component.html',
  styleUrls: ['./logics-edit.component.css']
})

export class LogicsEditComponent implements AfterViewChecked, OnInit {


  constructor(private route: ActivatedRoute,
              private fileService: FilesApiService,
              private pluginsapiService: PluginsApiService,
              private itemsapiService: ItemsApiService) { }



  // -----------------------------------------------------------------
  //  Vars for the codemirror components
  //
  rulers = [];

  // -----------------------------------------------------
  //  Vars for the YAML syntax checker
  //
  @ViewChild('codeeditor') private codeEditor;
  @ViewChild('watchitems') private codeEditorWatchItems;
  myEditFilename: string;
  autocomplete_list: {}[] = [];
  item_list: {}[] = [];
  myTextarea = '';
  myTextareaOrig = '';
  myTextareaWatchItems = '';
  myTextareaWatchItemsOrig = '';
  cmOptionsWatchItems = {
    autorefresh: true,
    lineWrapping: false
  }
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

    this.pluginsapiService.getPluginsAPI()
      .subscribe(
        (response) => {
          const result = <any>response;
          for (let i = 0; i < result.length; i++) {
            this.autocomplete_list.push({ text: 'sh.' + result[i], displayText: 'sh.' + result[i] + ' | Plugin'});
          }
        }
      );

    this.itemsapiService.getItemList()
      .subscribe(
        (response) => {
          const result = <any>response;
          for (let i = 0; i < result.length; i++) {
            this.item_list.push({text: result[i], displayText: result[i]});
            this.item_list.push({text: result[i], displayText: 'sh.' + result[i]});
            this.autocomplete_list.push({text: 'sh.' + result[i] + '()', displayText: 'sh.' + result[i] + '() | Item'});
          }
      }
    );

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
    this.registerAutocompleteHelper('autocompleteHint', this.autocomplete_list);
    this.registerAutocompleteHelper('autocompleteWatchItemsHint', this.item_list);
    // @ts-ignore
    CodeMirror.commands.autocomplete_shng = function(cm) {
      // @ts-ignore
      CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint);
    };
    // @ts-ignore
    CodeMirror.commands.autocomplete_shng_watch_items = function(cm) {
      // @ts-ignore
      CodeMirror.showHint(cm, CodeMirror.hint.autocompleteWatchItemsHint);
    };
  }

  registerAutocompleteHelper(name, curDict) {
    CodeMirror.registerHelper('hint', name, function(editor) {
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
  }

  ngAfterViewChecked() {
    const editor1 = this.codeEditor.codeMirror;
    const editor2 = this.codeEditorWatchItems.codeMirror;
    editor2.refresh();
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
          };
    });
    editor2.on('keyup', function (cm, event) {
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
            CodeMirror.commands.autocomplete_shng_watch_items(cm, null, {completeSingle: false});
          };
    });

    /* prohibit new lines for watch items input field */
    editor2.on('beforeChange', function(cm, changeObj) {console.log(changeObj);
      const typedNewLine = changeObj.origin === '+input' && typeof changeObj.text === 'object' && changeObj.text.join('') === '';
      if (typedNewLine) {
        return changeObj.cancel();
      }

      const pastedNewLine = changeObj.origin === 'paste' && typeof changeObj.text === 'object' && changeObj.text.length > 1;
      if (pastedNewLine) {
        const newText = changeObj.text.join(' ');
        return changeObj.update(null, null, [newText]);
      }
      return null;
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
