
import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilesApiService} from '../../common/services/files-api.service';
import * as CodeMirror from 'codemirror';
import {PluginsApiService} from '../../common/services/plugins-api.service';
import {ItemsApiService} from '../../common/services/items-api.service';
import {LogicsinfoType} from '../../common/models/logics-info';
import {LogicsApiService} from '../../common/services/logics-api.service';
import {LogicsWatchItem} from '../../common/models/logics-watch-item';

@Component({
  selector: 'app-logics-edit',
  templateUrl: './logics-edit.component.html',
  styleUrls: ['./logics-edit.component.css']
})

export class LogicsEditComponent implements AfterViewChecked, OnInit {

  logics: LogicsinfoType[];
  newlogics: LogicsinfoType[];
  logic: LogicsinfoType = <any>{};
  wrongWatchItem: boolean;
  logicCycleOrig: string;
  logicCrontabOrig: string;
  logicWatchitemOrig: LogicsWatchItem[];

  constructor(private route: ActivatedRoute,
              private dataService: LogicsApiService,
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

  cmOptionsWatchItems = {
    autorefresh: true,
    lineWrapping: false,
    indentWithTabs: false,
    indentUnit: 1,
    tabSize: 1,
  };

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
      },
      'Ctrl-L': function(cm) {
        cm.setOption('lineWrapping', !cm.getOption('lineWrapping'));
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
    this.wrongWatchItem = false;
    this.getLogicInfo();

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


  listToString(list) {
    let result = '';
    for (let i = 0; i < list.length; i++) {
      if (i > 0) {
        result += ' | ';
      }
      result += list[i];
    }
    return result;
  }


  stringToList(str) {
    let wrk = str.trim();
    if (wrk === '') {
      return <any>[];
    }
    wrk =  wrk.replace(/,/g, ' ');
    wrk =  wrk.replace(/\|/g, ' ');
    wrk =  wrk.replace(/   /g, ' ');
    while (wrk.indexOf('  ') !== -1) {
      wrk =  wrk.replace(/  /g, ' ');
    }
    return <any>wrk.split(' ');
  }


  getLogicInfo() {
    this.dataService.getLogics()
      .subscribe(
        (response) => {
          this.logics = <LogicsinfoType[]>response['logics'];
          this.logics.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
          for (const logic of this.logics) {
            if (this.myEditFilename === logic.filename) {
              console.warn('LogicsEditComponent.getLogics()', {logic});
              this.logic = logic;
            }
          }
          this.newlogics = <LogicsinfoType[]>response['logics_new'];
          this.newlogics.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
          for (const newlogic of this.newlogics) {
            if (this.myEditFilename === newlogic.filename) {
              console.warn('LogicsEditComponent.getLogics()', {newlogic});
              this.logic = newlogic;
            }
          }
          this.logicCycleOrig = this.logic.cycle;
          this.logicCrontabOrig = this.logic.crontab;
          this.logicWatchitemOrig = Array.from(this.logic.watch_item_list);
        }
      );
  }


  logicChanged() {
    if (this.codeChanged()) {
      return true;
    }
    if (this.parametersChanged()) {
      return true;
    }
    return false;
  }


  codeChanged() {
    if (this.myTextarea !== this.myTextareaOrig) {
      return true;
    }
    return false;
  }


  parametersChanged() {
    if (this.logic.cycle !== this.logicCycleOrig) {
      if (!(this.logic.cycle === null && this.logicCycleOrig === '')) {
        return true;
      }
    }
    if (this.logic.crontab !== this.logicCrontabOrig) {
      if (!(this.logic.crontab === null && this.logicCrontabOrig === '')) {
        return true;
      }
    }
    if (typeof(this.logic.watch_item_list) !== 'undefined') {
      let allIdenticalFlag = true;
      for (const watchItemOrig of this.logicWatchitemOrig) {
        if (!this.logic.watch_item_list.includes(watchItemOrig)) {
          allIdenticalFlag = false;
        }
        if (this.logic.watch_item_list.length > this.logicWatchitemOrig.length) {
          allIdenticalFlag = false;
        }
      }
      return !allIdenticalFlag;
    }
    return false;
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

  removeItem(itemName) {
    console.log('Trying to remove item ' + itemName);
    for (const j of this.logic.watch_item_list) {
      if (<any>j === itemName) {
        const index = this.logic.watch_item_list.indexOf(j)
        if (index > -1) {
          console.log('Removing item ' + j);
          this.logic.watch_item_list.splice(index, 1);
          return;
        }
      }
    }
    console.log('Item not in list!');
    return;
  }

  addItem() {
    console.log('Trying to add item ' + this.myTextareaWatchItems);
    for (const i of this.item_list) {
      if (i['text'] === this.myTextareaWatchItems) {
        for (const j of this.logic.watch_item_list) {
          if (<any>j === this.myTextareaWatchItems) {
            console.log('Item already in list!');
            this.wrongWatchItem = true;
            return;
          }
        }
        console.log('Adding item to list: ' + this.myTextareaWatchItems);
        this.logic.watch_item_list.push(<any>this.myTextareaWatchItems);
        this.myTextareaWatchItems = '';
        this.wrongWatchItem = false;
        return;
      }
    }
    console.log('Item does not exist');
    this.wrongWatchItem = true;
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

    const editor2 = this.codeEditorWatchItems.codeMirror;
    editor2.setSize('50vw', 'auto');
    editor2.refresh();
    editor2.on('keyup', function (cm, event, component = this) {
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
      }
      if (event.keyCode === 13) {
        console.log(editor2.state);
      }
    });

    /* prohibit new lines, spaces and tabs for watch items input field */
    editor2.on('beforeChange', function(cm, changeObj) {
      const typedNewLine = changeObj.origin === '+input' && typeof changeObj.text === 'object' && changeObj.text.join('') === '';
      const typedSpaceorTab = (changeObj.origin === '+input' || changeObj.origin === 'paste') && (!/^[a-z0-9\.\_\-]+$/i.
        test(changeObj.text[0]));
      if (typedNewLine || typedSpaceorTab) {
        return changeObj.cancel();
      }
      return null;
    });
  }


  saveCode(reload = false) {
    // console.log('LoggingConfigurationComponent.saveCode');
    this.fileService.saveFile('logics', this.myEditFilename, this.myTextarea)
      .subscribe(
        (response) => {
          // after saving the code, set Orig var to signal the editor shows "unchanged code"
          this.myTextareaOrig = this.myTextarea;

          if (reload) {
            this.reloadLogic(this.logic.name);
          }
        }
      );
  }

  discardChanges() {
    this.myTextarea = this.myTextareaOrig;
    this.logic.cycle = this.logicCycleOrig;
    this.logic.crontab = this.logicCrontabOrig;
    this.logic.watch_item_list = Array.from(this.logicWatchitemOrig);
  }

  saveParameters(reload) {
    // console.log('LoggingConfigurationComponent.saveParameters');

    // this.watchitemsToList();
    // this.logic.watch_item_list = this.stringToList(this.myTextareaWatchItems);

    const params = {};
    params['cycle'] = this.logic.cycle;
    params['crontab'] = this.logic.crontab;
    params['watch_item'] = this.logic.watch_item_list;

    this.dataService.saveLogicParameters(this.logic.name, params)
      .subscribe(
        (response) => {
          // after saving the parameters, set Orig vars to signal the editor shows "unchanged values"
          this.logicCycleOrig = this.logic.cycle;
          this.logicCrontabOrig = this.logic.crontab;

          // this.watchitemsFromList();
          this.logicWatchitemOrig = this.logic.watch_item_list;

          if (reload) {
            this.reloadLogic(this.logic.name);
          }
        }
      );

  }


  saveLogic(reload = false) {
    if (this.codeChanged()) {
      if (this.parametersChanged()) {
        this.saveCode();
      } else {
        this.saveCode(reload);
      }
    }
    if (this.parametersChanged()) {
      this.saveParameters(reload);
    }

    const editor = this.codeEditor.codeMirror;
    editor.refresh();

  }


  triggerLogic() {
    // console.log('triggerLogic', {logicName});
    this.dataService.setLogicState(this.logic.name, 'trigger')
      .subscribe(
        (response) => {
          // this.getLogics();
        }
      );
  }


  reloadLogic(logicName) {
    // console.log('reloadLogic', {logicName});
    this.dataService.setLogicState(logicName, 'reload')
      .subscribe(
        (response) => {
          // this.getLogics();
        }
      );
  }
}
