
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { faPlus, faPlusCircle, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';

// import { DeleteConfigComponent } from './delete-config/delete-config.component';

import { ServerApiService } from '../../common/services/server-api.service';
import { PluginsApiService } from '../../common/services/plugins-api.service';
import { OlddataService } from '../../common/services/olddata.service';

import { SharedService } from '../../common/services/shared.service';

import {AppComponent} from '../../app.component';
import {PlugininfoType} from '../../common/models/plugin-info';
import {ServerInfo} from '../../common/models/server-info';
import { PluginsConfig } from '../../common/models/plugins-config';
import { PluginsInstalled } from '../../common/models/plugins-installed';
import {SceneInfo} from '../../common/models/scene-info';


export interface ConfiguredPlugin { confname: string; instance: string; plugin: string; desc: string; }


@Component({
  selector: 'app-config',
  templateUrl: './plugin-config.component.html',
  styleUrls: ['./plugin-config.component.css'],
  providers: [AppComponent]
})
export class PluginConfigComponent implements OnInit {

  faPlus = faPlus;
  faPlusCircle = faPlusCircle;
  faPlusSquare = faPlusSquare;

  configuredplugins: ConfiguredPlugin[];
  cols: any[];
  pluginconflist: PluginsConfig;
  restart_core_button: boolean;

  server_info: ServerInfo;
  lang: string;

  // display modal edit dialog
  parameters: any[];
  plugin_enabled: boolean;
  parameter_cols: any[];
  classic: boolean = false;
  rowclicked_foredit: any = false;

  // for list of installed plugins dialog
  dialog_display: boolean = false;
  dialog_readonly: boolean = false;
  dialog_configname: string;
  dialog_pluginname: string;
  dialog_description: string;


  // for add dialog
  add_display: boolean = false;
  plugintypes: string[] = ['system', 'gateway', 'interface', 'protocol', 'web', 'unclassified'];
  plugintypes_expanded: boolean[] = [];
  spinner_display: boolean = false;
  add_firstrun: boolean = true;
  plugins_installed: PluginsInstalled;
  plugins_installed_list: string[];

  // set configuration name dialog
  setconfig_display: boolean = false;
  selected_plugin: string;
  pluginconfig_name: string;
  translate_params: {} = {};
  add_enabled: boolean;

  validation_dialog_display: boolean = false;
  validation_dialog_parameter: string;
  validation_dialog_text: string[];

  // confirm delete dialog
  confirmdelete_display: boolean = false;
  delete_param: {};


  constructor(private cdRef: ChangeDetectorRef,
//              private deleteConfigComponent: DeleteConfigComponent,
              private serverdataService: ServerApiService,
              private pluginsdataService: PluginsApiService,
              private dataService: OlddataService,
              private translate: TranslateService,
              private shared: SharedService,
              private router: Router) { }


  ngOnInit() {
    // console.log('PluginConfigComponent.ngOnInit');

    // this.translate.use(this.lang);
    this.shared.setGuiLanguage();
    this.lang = sessionStorage.getItem('default_language');


    this.pluginsdataService.getPluginsConfig()
      .subscribe(
        (response) => {
          this.pluginconflist = <any>response;
          // console.log(this.pluginconflist);

          for (const plg in this.pluginconflist.plugin_config) {
            if (this.pluginconflist.plugin_config.hasOwnProperty(plg) ) {
              const confname = plg;
              let plgname = this.pluginconflist.plugin_config[plg]['plugin_name'];
              if (plgname === undefined) {
                plgname = this.pluginconflist.plugin_config[plg]['class_path'];
              }
              const instance = this.pluginconflist.plugin_config[plg]['instance'];
              const conf = {'confname': confname, 'instance': instance, 'plugin': plgname, 'desc': '' };

              let enabled = 'true';
              if (this.pluginconflist.plugin_config[plg]['plugin_enabled'] === 'False') {
                enabled = 'false';
              }
              // is plugin enabled?
              conf['enabled'] = enabled;

              // get logo for plugin type
              const meta = this.pluginconflist.plugin_config[confname]['_meta'];
              if (meta === undefined) {
                conf['type'] = 'classic';
              } else {
                conf['type'] = meta.plugin.type;
              }


              // get description from plugin_config (faster)
              let desc = this.pluginconflist.plugin_config[plg]['_description'];
              if (conf['type'] === undefined || conf['type'] === 'classic') {
                conf['type'] = 'classic';
                desc = this.pluginconflist.plugin_config[plg]['_meta']['plugin']['description'];
              }
              if (desc !== undefined) {
                // if a description is defined
                conf['desc'] = desc[this.lang];
                if (conf['desc'] === undefined) {
                  // if description in selected language is undefined, use fallbak language
                  conf['desc'] = desc[this.shared.getFallbackLanguage()];
                }
              }

              // add to the table of configured plugins
              this.configuredplugins.push(conf);
            }
          }

        }
      );


    this.cols = [
      { field: 'enabled',  sfield: '',         header: '',                   width:  '30px' },
      { field: 'type',     sfield: 'type',     header: '',                   width:  '30px' },
      { field: 'confname', sfield: 'confname', header: 'PLUGIN.CONFIGNAME',  width: '150px' },
      { field: 'plugin',   sfield: 'plugin',   header: 'PLUGIN.PLUGINNAME',  width: '200px' },
      { field: 'instance', sfield: 'instance', header: 'PLUGIN.INSTANCE',    width: '150px' },
      { field: 'desc',     sfield: '',         header: 'PLUGIN.DESCRIPTION', width: '' }
      ];

    this.configuredplugins = [];

  }



  // ---------------------------------------------------------
  // Handle the click event on the list of installed plugins
  //
  //  - Get the configuration data for the selected plugin
  //    for the modal dialog
  //
  rowClicked(event, rowdata) {
    // console.warn('rowClicked')
    // console.log({rowdata})
    this.dialog_configname = rowdata.confname;
    this.dialog_pluginname = rowdata.plugin;
    this.rowclicked_foredit = rowdata;

    const conf = this.pluginconflist.plugin_config[rowdata.confname]
    const meta = this.pluginconflist.plugin_config[rowdata.confname]['_meta']
    let desc = null;
    this.classic = true;
    if (meta !== undefined && meta.plugin !== undefined) {
      if  (meta.plugin.type !== undefined && meta.plugin.type !== 'classic') {
        this.classic = false;
      }
      desc = meta['plugin']['description'];
    }
    this.dialog_readonly = this.pluginconflist.readonly;
    if (desc !== null && desc !== undefined) {
      this.dialog_description = desc[this.lang];
    }

    this.plugin_enabled = true;
    if (conf.plugin_enabled !== undefined) {
      if (typeof conf.plugin_enabled === 'string' && conf.plugin_enabled.toLowerCase() === 'false') {
        this.plugin_enabled = false;
      }
    }

    this.parameter_cols = [
      { field: 'name',  sfield: 'confname',   header: 'PLUGIN.PARAMETER',   width: '150px', iwidth: '146px' },
      { field: 'value', sfield: 'paramvalue', header: 'PLUGIN.VALUE',       width: '200px', iwidth: '196px' },
      { field: 'type',  sfield: 'conftype',   header: 'PLUGIN.TYPE',        width: '100px', iwidth:  '96px' },
      { field: 'desc',  sfield: '',           header: 'PLUGIN.DESCRIPTION', width: '',      iwidth: '' }
    ];

    this.parameters = [];

    if (meta !== undefined && meta['parameters'] !== 'NONE') {
      for (const param in meta['parameters']) {
        if (meta['parameters'].hasOwnProperty(param) ) {

          const vl = [];
          if (meta['parameters'][param]['valid_list'] !== undefined) {
            for (let i = 0; i < meta['parameters'][param]['valid_list'].length; i++) {
              const wrk = {label: String(meta['parameters'][param]['valid_list'][i]), value: meta['parameters'][param]['valid_list'][i]};
              vl.push(wrk);
            }
          }

          // generate a valid_list for bool parameters
          if (meta['parameters'][param]['type'] === 'bool') {
            let wrk = {};
            wrk = {label: 'true', value: true};
            vl.push(wrk);
            wrk = {label: 'false', value: false};
            vl.push(wrk);
          }

          // fill description with active language
          let paramdesc = ''
          if (meta['parameters'][param]['description'] !== undefined) {
            paramdesc = meta['parameters'][param]['description'][this.lang];
            if (paramdesc === '' || paramdesc === undefined) {
              paramdesc = meta['parameters'][param]['description']['en'];
            }
          }

          const paramdata = {
            'name': param,
            'type': meta['parameters'][param]['type'],
            'valid_list': vl,
            'valid_min': meta['parameters'][param]['valid_min'],
            'valid_max': meta['parameters'][param]['valid_max'],
            'default': meta['parameters'][param]['default'],
            'mandatory': meta['parameters'][param]['mandatory'],
            'value': conf[param],
            'desc': paramdesc};

          if (paramdata.type === 'bool') {
            if (conf[param] === undefined) {
              paramdata.value = null;
            } else if (typeof conf[param] === 'boolean') {
              paramdata.value = conf[param];
            } else {
              if (conf[param] === null) {
                paramdata.value = null;
              } else {
                paramdata.value = (conf[param].toLowerCase() === 'true');
              }
            }
          } else {
            paramdata.value = <string>conf[param];
          }

          // add to the table of configured plugins
          this.parameters.push(paramdata);
        }
      }
    }
/*
    // find out, if instance parameter is defined
    let instance_defined = false;
    for (const i in this.parameters) {
      if (this.parameters.hasOwnProperty(i) ) {
        if (this.parameters[i].name === 'instance') {
          instance_defined = true;
        }
      }
    }
    console.log({instance_defined});
*/
    this.dialog_display = true;

  }


  saveConfig() {
    const conf = this.pluginconflist.plugin_config[this.dialog_configname];

    let errors_found = false;
    this.validation_dialog_text = [];
    for (let i = 0; i < this.parameters.length; i++) {
      let error_found = false;
      let error_text = '';
      if (this.parameters[i]['value'] === '') {
        conf[this.parameters[i]['name']] = undefined;
      } else {
        conf[this.parameters[i]['name']] = this.parameters[i]['value'];
      }

      // checking data types
      if (this.parameters[i]['value'] !== undefined && this.parameters[i]['value'] !== '') {
        error_text = '\'' + this.parameters[i]['value'] + '\' '  ;
        if (this.parameters[i]['type'].toLowerCase() === 'knx_ga' && !this.shared.is_knx_groupaddress(this.parameters[i]['value'])) {
          error_found = true;
          error_text += this.translate.instant('PLUGIN.INVALID_KNX_ADDRESS');
        }
        if (this.parameters[i]['type'].toLowerCase() === 'mac' && !this.shared.is_mac(this.parameters[i]['value'])) {
          error_found = true;
          error_text += this.translate.instant('PLUGIN.INVALID_MAC_ADDRESS');
        }
        if (this.parameters[i]['type'].toLowerCase() === 'ipv4' && !this.shared.is_ipv4(this.parameters[i]['value'])) {
          error_found = true;
          error_text += this.translate.instant('PLUGIN.INVALID_IP_ADDRESS') + ' (v4)';
        }
        if (this.parameters[i]['type'].toLowerCase() === 'ipv6' && !this.shared.is_ipv6(this.parameters[i]['value'])) {
          error_found = true;
          error_text += this.translate.instant('PLUGIN.INVALID_IP_ADDRESS') + ' (v6)';
        }
        if (this.parameters[i]['type'].toLowerCase() === 'ip') {
          if (!this.shared.is_ipv4(this.parameters[i]['value']) && !this.shared.is_ipv6(this.parameters[i]['value'])) {
            if (!this.shared.is_hostname(this.parameters[i]['value'])) {
              error_found = true;
              error_text += this.translate.instant('PLUGIN.INVALID_HOSTNAME');
            }
          }
        }
      }

      // check valid minimum and maximum value
      if (this.parameters[i]['value'] < this.parameters[i]['valid_min']) {
        error_found = true;
        error_text = this.translate.instant('PLUGIN.DEFINED_MIN') + ' \'' + this.parameters[i]['valid_min'] + '\'';
        error_text += ', ' + this.translate.instant('PLUGIN.ACTUAL_VALUE') + ' \'' + this.parameters[i]['value'] + '\'';
      }
      if (this.parameters[i]['value'] > this.parameters[i]['valid_max']) {
        error_found = true;
        error_text = this.translate.instant('PLUGIN.DEFINED_MAX') + ' \'' + this.parameters[i]['valid_max'] + '\'';
        error_text += ', ' + this.translate.instant('PLUGIN.ACTUAL_VALUE') + ' \'' + this.parameters[i]['value'] + '\'';
      }

      // check if value is mandantory
      if ((this.parameters[i]['value'] === undefined || this.parameters[i]['value'] === '') && this.parameters[i]['mandatory']) {
        error_found = true;
        error_text = this.translate.instant('PLUGIN.MANDATORY_VALUE');
      }
      if (error_found) {
        errors_found = true;
        error_found = false;
        this.validation_dialog_text.push(this.translate.instant('PLUGIN.PARAMETER') + ' \'' + this.parameters[i]['name'] + '\': ' + error_text);
        this.validation_dialog_parameter = this.parameters[i]['name'];

        this.validation_dialog_display = true;
      }

    }
    // if validation did not fiind errors
    if (!errors_found) {
      // hide configuration dialog
      this.dialog_display = false;

      if (this.plugin_enabled === false) {
        this.pluginconflist.plugin_config[this.dialog_configname]['plugin_enabled'] = false;
        this.rowclicked_foredit.enabled = 'false';
      } else {
        this.pluginconflist.plugin_config[this.dialog_configname]['plugin_enabled'] = true;
        this.rowclicked_foredit.enabled = 'true';
      }
      this.rowclicked_foredit.instance = this.pluginconflist.plugin_config[this.dialog_configname]['instance']

      // save configuration of the edited plugin to the backend to section <this.dialog_configname>
      console.log('save configuration of "' + this.dialog_configname + '" to Backend');
      const config = JSON.parse(JSON.stringify( this.pluginconflist.plugin_config[this.dialog_configname] ));
      delete config['_meta'];
      delete config['_description'];
      console.log({config});
      for (const conf in config) {
        if (config.hasOwnProperty(conf) ) {
          if (config[conf] === null) {
            delete config[conf];
          }
          console.log({conf}, config[conf]);
        }
      }

      this.restart_core_button = true;

      // transfer to backend server
      this.pluginsdataService.setPluginConfig(this.dialog_configname, {'config': config})
        .subscribe(
            (response: any) => {
              if (response.result !== 'ok') {
                // display error dialog, if save failed?
              }
            }
          );
    }
  }


  restartShng() {
    this.serverdataService.restartShngServer()
      .subscribe(
        (response) => {
          const res = <any> response;
          console.log('restartShng', res.result);
        }
      );
    this.restart_core_button = false;
  }



  // -------------------------------------------------------------------
  //  Add configuration
  //
  addPluginDialog() {
    console.log('PluginConfigComponent.addPluginDialog:');

    for (let i = 0; i < this.plugintypes.length; i++) {
      this.plugintypes_expanded[i] = !this.add_firstrun;
    }
    this.add_firstrun = false;

    this.spinner_display = true;
    this.pluginsdataService.getInstalledPlugins()
      .subscribe(
        (response) => {
          this.plugins_installed = <PluginsInstalled>response;
          this.plugins_installed_list = Object.keys(<PluginsInstalled>response);
//          this.schedulerinfo.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)});
          console.log('addPluginDialog', {response});

          this.spinner_display = false;
          this.add_display = true;

          for (let i = 0; i < this.plugintypes.length; i++) {
            this.plugintypes_expanded[i] = false;
          }
        }
      );

  }


  selectPlugin(iplugin) {
    console.warn({iplugin})
    this.selected_plugin = iplugin;
    this.pluginconfig_name = '';
    this.translate_params = {'selected_plugin': this.selected_plugin}
    this.add_enabled = false;

    this.setconfig_display = true;
    // alert('code for selecting plugin "' + iplugin + '" is not yet implemented!');
  }


  checkInput() {
    this.add_enabled = false;
    if (this.pluginconfig_name.length > 0) {
      this.add_enabled = true;
      for (const conf in this.configuredplugins) {
        if (this.configuredplugins[conf].confname === this.pluginconfig_name) {
          this.add_enabled = false;
        }
      }

    }
    console.warn(this.add_enabled);
  }


  addPlugin() {
    console.warn(this.selected_plugin, this.pluginconfig_name);
    this.setconfig_display = false;
    this.add_display = false;
    const config = {'plugin_name': this.selected_plugin, 'plugin_enabled': false};

    // transfer to backend server
    this.pluginsdataService.addPluginConfig(this.pluginconfig_name, {'config': config})
      .subscribe(
        (response: any) => {
          if (response) {
            console.log('PluginConfigComponent.addPlugin(): call ngOnInit()');
            this.ngOnInit();
          }
        }
      );
  }



  // -------------------------------------------------------------------
  //  Delete configuration
  //
  DeleteConfig() {
    console.log('PluginConfigComponent.DeleteConfig:');
    console.warn(this.dialog_configname);

    this.delete_param = {'config': this.dialog_configname};

    this.confirmdelete_display = true;


  }


  DeleteConfigConfirm() {
    console.log('PluginConfigComponent.DeleteConfigConfirm:');
    console.warn(this.dialog_configname);

    // close confirm dialog
    this.confirmdelete_display = false;

    // delete on backend server
    this.pluginsdataService.deletePluginConfig(this.dialog_configname)
      .subscribe(
        (response: any) => {
          if (response) {
            // close configuration dialog
            this.dialog_display = false;
            console.log('PluginConfigComponent.DeleteConfigConfirm(): call ngOnInit()');
            this.ngOnInit();
            this.restart_core_button = true;

          }
        }
      );

    // alert('code for removal of plugin "' + this.dialog_configname + '" configurations is not yet implemented');


    return true;
  }


  DeleteConfigAbort() {
    console.log('PluginConfigComponent.DeleteConfigAbort:');

    // close confim dialog
    this.confirmdelete_display = false;

    return false;
  }
}

