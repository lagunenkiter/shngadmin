
import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FilesApiService} from '../../common/services/files-api.service';
import * as CodeMirror from 'codemirror';
import {PluginsApiService} from '../../common/services/plugins-api.service';
import {ItemsApiService} from '../../common/services/items-api.service';
import {LogicsinfoType} from '../../common/models/logics-info';
import {LogicsApiService} from '../../common/services/logics-api.service';
import {LogicsWatchItem} from '../../common/models/logics-watch-item';
import {SharedService} from '../../common/services/shared.service';

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
  logicChanged: boolean;
  logicCycleOrig: string;
  logicCrontabOrig: string;
  logicWatchitemOrig: LogicsWatchItem[];

  parameters: any[] = [];
  parameter_cols: any[];
  pluginParameters: {} = {};

  constructor(private route: ActivatedRoute,
              private dataService: LogicsApiService,
              private fileService: FilesApiService,
              private pluginsapiService: PluginsApiService,
              private shared: SharedService,
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
  myLogicName: string;
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
  parameterHelp_display = false;
  error_display = false;


  ngOnInit() {

    const logic = this.route.snapshot.paramMap['params']['logicname'].split('|');
    if (logic.length === 1) {
      logic.push('');
    }
    this.myEditFilename = logic[1].trim();
    this.myLogicName = logic[0].trim();
    // console.log('LogicsEditComponent.ngOnInit()', {logic});

    // let logicName = this.route.snapshot.paramMap['params']['logicname'];
    // if (logicName !== undefined) {
    //   if (logicName.endsWith('.log')) {
    //     logicName = logicName.slice(0, -4);
    //   }
    // }

    // this.myEditFilename = logicName;
    for (let i = 1; i <= 100; i++) {
      this.rulers.push({color: '#eee', column: i * 4, lineStyle: 'dashed'});
    }
    this.wrongWatchItem = false;
    this.logicChanged = false;

    this.getLogicInfo(this.myLogicName);

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

    this.registerAutocompleteHelper('autocompleteHint', this.autocomplete_list);
    this.registerAutocompleteHelper('autocompleteWatchItemsHint', this.item_list);
    // @ts-ignore
    CodeMirror.commands.autocomplete_shng = function(cm) {
      // @ts-ignore
      CodeMirror.showHint(cm, CodeMirror.hint.autocompleteHint, {'completeSingle': false});
    };
    // @ts-ignore
    CodeMirror.commands.autocomplete_shng_watch_items = function(cm) {
      // @ts-ignore
      CodeMirror.showHint(cm, CodeMirror.hint.autocompleteWatchItemsHint, {'completeSingle': false});
    };
  }


  getPluginParameterDefinitions() {

    // console.warn('getPluginParameterDefinitions', this.logic);
    this.parameter_cols = [
      { field: 'name',  sfield: 'confname',   header: 'PLUGIN.PARAMETER',   width: '150px', iwidth: '146px' },
      { field: 'value', sfield: 'paramvalue', header: 'PLUGIN.VALUE',       width: '200px', iwidth: '196px' },
      { field: 'type',  sfield: 'conftype',   header: 'PLUGIN.TYPE',        width: '100px', iwidth:  '96px' },
      { field: 'desc',  sfield: '',           header: 'PLUGIN.DESCRIPTION', width: '',      iwidth: '' }
    ];

    this.pluginsapiService.getPluginsLogicParameters()
      .subscribe(
        (response) => {
          this.pluginParameters = <any>response;
          // console.log('ngOnInit: pluginParameters', this.pluginParameters);

          for (const param in this.pluginParameters) {
            if (param in this.pluginParameters) {
              const paramdef = this.pluginParameters[param];

              const vl = [];
              if (paramdef['valid_list'] !== undefined) {
                for (let i = 0; i < paramdef['valid_list'].length; i++) {
                  const wrk = {label: String(paramdef['valid_list'][i]), value: paramdef['valid_list'][i]};
                  vl.push(wrk);
                }
              }

              // generate a valid_list for bool parameters
              if (paramdef['type'] === 'bool') {
                if (vl.length === 0) {
                  let wrk = {};
                  wrk = {label: 'true', value: true};
                  vl.push(wrk);
                  wrk = {label: 'false', value: false};
                  vl.push(wrk);
                }
              }

              // fill description with active language
              const paramdesc = this.shared.getDescription(paramdef['description']);

              let val = null;
              val = this.logic[param];
              // console.log({param}, {val});
              if (val === undefined || val === null) {
                val = null;
              }
              if (paramdef['type'] === 'list') {
                val = this.listToString(val);
              }

              const paramdata = {
                'name': param,
                'type': paramdef['type'],
                'valid_list': vl,
                'valid_min': paramdef['valid_min'],
                'valid_max': paramdef['valid_max'],
                'default': paramdef['default'],
                'mandatory': paramdef['mandatory'],
                'value': val,
                'value_orig': val,
                'desc': paramdesc
              };

              if (paramdata['type'] === 'list') {
                // console.log({paramdef});
                if (paramdef['default'] !== undefined) {
                  paramdata['default'] = this.listToString(paramdef['default']);
                }
              }
              if (paramdef['hide'] && (['str', 'int'].indexOf(paramdef['type']) !== -1)) {
                paramdata['type'] = 'hide' + '-' + paramdef['type'];
              }

              if (paramdata.type === 'bool') {
                if (val === undefined) {
                  paramdata.value = null;
                } else if (typeof val === 'boolean') {
                  paramdata.value = val;
                } else {
                  if (val === null) {
                    paramdata.value = null;
                  } else {
                    paramdata.value = (val.toLowerCase() === 'true');
                  }
                }
              } else if (paramdata.type === 'list') {
                paramdata.value = this.listToString(<string>val);
              } else {
                paramdata.value = <string>val;
              }

              // add to the table of configured plugins
              this.parameters.push(paramdata);
            }
          }
        }
      );

  }


  listToString(list) {
    let result = '';
    if (list === null) {
      result = null;
    } else if (typeof list === 'string') {
      result = list;
    } else {
      if (list !== undefined) {
        for (let i = 0; i < list.length; i++) {
          if (i > 0) {
            result += ' | ';
          }
          result += list[i];
        }
      }
    }
    return result;
  }


  stringToList(str) {
    // let wrk = str.trim();
    // wrk =  wrk.replace(/,/g, ' ');   // comma is no delimiter
    // wrk =  wrk.replace(/\|/g, ' ');
    // wrk =  wrk.replace(/   /g, ' ');
    // while (wrk.indexOf('  ') !== -1) {
    //   wrk =  wrk.replace(/  /g, ' ');
    // }
    if (str === null) {
      return <any>[];
    } else if (str.trim() === '') {
      return <any>[];
    }
    const list = <any>str.split('|');
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].trim();
    }
    return list;
  }


  getLogicInfo(logicname) {
    // console.warn({logicname});
    this.dataService.getLogic(logicname)
      .subscribe(
        (response) => {
          this.logic = <any>response;
          // console.warn('LogicsEditComponent.getLogicInfo() this.logic', this.logic);

          if (this.logic.enabled === undefined) {
            this.logic.enabled = true;
          }
          if (this.logic.cycle === undefined) {
            this.logic.cycle = null;
          }
          if (this.logic.crontab === undefined) {
            this.logic.crontab = null;
          }
          console.log('typeof this.logic.crontab', typeof this.logic.crontab, this.logic.crontab);
          this.logic.crontab = this.listToString(this.logic.crontab);
          console.log('typeof this.logic.crontab', typeof this.logic.crontab, this.logic.crontab);

          if (this.myEditFilename === '') {
            if (this.logic.filename !== null && this.logic.filename !== undefined && this.logic.filename !== '') {
              this.myEditFilename = this.logic.filename;
            }
          }

          this.fileService.readFile('logics', this.myEditFilename)
            .subscribe(
              (responseFile) => {
                this.myTextarea = responseFile;
                // console.log('ngOnInit', 'read', {responseFile});
                const editor = this.codeEditor.codeMirror;
                editor.setOption('lineSeparator', '\n');
                if (this.myTextarea.indexOf('\r\n') >= 0) {
                  editor.setOption('lineSeparator', '\r\n');
                }
                this.myTextareaOrig = this.myTextarea;
              }
            );

          this.getPluginParameterDefinitions();

          this.logicCycleOrig = this.logic.cycle;
          this.logicCrontabOrig = this.logic.crontab;
          this.logicWatchitemOrig = [];
          if (this.logic.watch_item !== undefined) {
            if (typeof (this.logic.watch_item) === 'string') {
              this.logicWatchitemOrig = Array.from(this.logic.watch_item);
            } else {
              this.logicWatchitemOrig = Array.from(this.logic.watch_item);
              // console.log('this.logic.watch_item', this.logic.watch_item);
            }
          } else {
            this.logic.watch_item = [];
            this.logicWatchitemOrig = [];
          }
        }
      );
  }


  hasLogicChanged() {
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
        // console.log('parametersChanged:', 'cycle', this.logic.cycle, ':' + this.logicCycleOrig + ':');
        return true;
      }
    }
    if (this.logic.crontab !== this.logicCrontabOrig) {
      if (!(this.logic.crontab === null && this.logicCrontabOrig === '')) {
        // console.log('parametersChanged:', 'crontab');
        return true;
      }
    }

    for (let i = 0; i < this.parameters.length; i++) {
      if (this.parameters[i].value !== this.parameters[i].value_orig) {
        // console.log('parametersChanged:', this.parameters[i].name, this.parameters[i].value, ':' + this.parameters[i].value_orig + ':');
        return true;
      }
    }

    if (typeof(this.logic.watch_item) !== 'undefined') {
      // console.log(this.logicWatchitemOrig, this.logic.watch_item);
      let allIdenticalFlag = true;
      for (const watchItemOrig of this.logicWatchitemOrig) {
        if (!this.logic.watch_item.includes(watchItemOrig)) {
          console.log('parametersChanged', {watchItemOrig});
          allIdenticalFlag = false;
        }
      }
      if (this.logic.watch_item.length !== this.logicWatchitemOrig.length) {
        // console.log('parametersChanged', 'length changed');
        allIdenticalFlag = false;
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

      const charexp =  /[\w\.\w$]+/;
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
    for (const j of this.logic.watch_item) {
      if (<any>j === itemName) {
        const index = this.logic.watch_item.indexOf(j);
        if (index > -1) {
          this.logic.watch_item.splice(index, 1);
          this.logicChanged = this.hasLogicChanged();
          return;
        }
      }
    }
    return;
  }

  addItem() {
    for (const i of this.item_list) {
      if (i['text'] === this.myTextareaWatchItems) {
        for (const j of this.logic.watch_item) {
          if (<any>j === this.myTextareaWatchItems) {
            this.wrongWatchItem = true;
            return;
          }
        }
        this.logic.watch_item.push(<any>this.myTextareaWatchItems);
        this.myTextareaWatchItems = '';
        this.wrongWatchItem = false;
        this.logicChanged = this.hasLogicChanged();
        return;
      }
    }
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

    const editor2 = this.codeEditorWatchItems.codeMirror;
    editor2.setSize('50vw', 'auto');
    editor2.refresh();
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

  logicsCodeKeyUp(event) {
    this.logicChanged = this.hasLogicChanged();
    const editor1 = this.codeEditor.codeMirror;
    if (!editor1.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
      ( event.keyCode !== 9 &&
        event.keyCode !== 13 &&
        event.keyCode !== 27 &&
        event.keyCode !== 37 &&
        event.keyCode !== 38 &&
        event.keyCode !== 39 &&
        event.keyCode !== 40 &&
        event.keyCode !== 46)) {
      // @ts-ignore
      CodeMirror.commands.autocomplete_shng(editor1);
    }
  }

  watchItemKeyUp(event) {
    const editor2 = this.codeEditorWatchItems.codeMirror;
    if ((!editor2.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
      ( event.keyCode !== 9 &&
        event.keyCode !== 13 &&
        event.keyCode !== 27 &&
        event.keyCode !== 37 &&
        event.keyCode !== 38 &&
        event.keyCode !== 39 &&
        event.keyCode !== 40 &&
        event.keyCode !== 46))) {  // && event.keyCode !== 8 && event.keyCode !== 17 && event.keyCode !== 86)
      // @ts-ignore
      CodeMirror.commands.autocomplete_shng_watch_items(editor2);
    }
  }


  saveCode(reload = false) {
    // console.log('LoggingConfigurationComponent.saveCode');
    this.fileService.saveFile('logics', this.myEditFilename, this.myTextarea)
      .subscribe(
        (response) => {
          // after saving the code, set Orig var to signal the editor shows "unchanged code"
          this.myTextareaOrig = this.myTextarea;
          this.logicChanged = this.hasLogicChanged();
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
    this.logic.watch_item = Array.from(this.logicWatchitemOrig);
    for (let i = 0; i < this.parameters.length; i++) {
      this.parameters[i].value = this.parameters[i].value_orig;
    }

    this.logicChanged = this.hasLogicChanged();
  }

  saveParameters(reload) {
    // console.log('LoggingConfigurationComponent.saveParameters');

    const params = {};

    if (!(parseInt(this.logic.cycle, 10) > 0)) {
      this.logic.cycle = null;
    }
    params['cycle'] = this.logic.cycle;
    params['crontab'] = this.stringToList(this.logic.crontab);
    this.logic.crontab = this.listToString(params['crontab']);

    params['watch_item'] = this.logic.watch_item;
    this.logicWatchitemOrig = Array.from(this.logic.watch_item);

    for (const param in this.pluginParameters) {
      if (param in this.pluginParameters) {
        params[param] = null;
        for (let i = 0; i < this.parameters.length; i++) {
          if (this.parameters[i].name === param) {
            if (this.parameters[i].type === 'list') {
              params[param] = this.stringToList(this.parameters[i].value);
              this.parameters[i].value = this.listToString(params[param]);
            } else {
              params[param] = this.parameters[i].value;
            }
            this.parameters[i].value_orig = this.parameters[i].value;
          }
        }
      }
    }

    this.dataService.saveLogicParameters(this.myLogicName, params)
      .subscribe(
        (response) => {
          // after saving the parameters, set Orig vars to signal the editor shows "unchanged values"
          this.logicCycleOrig = this.logic.cycle;
          this.logicCrontabOrig = this.logic.crontab;

          // this.watchitemsFromList();
          // ? this.logicWatchitemOrig = Array.from(this.logic.watch_item_list);
          this.logicChanged = this.hasLogicChanged();

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
