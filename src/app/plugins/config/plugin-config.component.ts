
import {Component, OnInit, TemplateRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { faPlus, faPlusCircle, faPlusSquare } from '@fortawesome/free-solid-svg-icons';


import {ItemDetails} from '../../models/item-details';
import { ServerDataService } from '../../common/services/server-data.service';
import { OlddataService } from '../../common/services/olddata.service';
import { PluginService } from '../../common/services/plugin.service';
import {TranslateService} from '@ngx-translate/core';

import { SharedService } from '../../common/services/shared.service';
import {AppComponent} from '../../app.component';
import {PlugininfoType} from '../../models/plugin-info';
import {ServerInfo} from '../../models/server-info';
import {PluginConfig} from '../../models/plugin-config';


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

  configuredplugins: any[];
  cols: any[];
  pluginconflist: PluginConfig;
  restart_core_button: boolean;

  server_info: ServerInfo;
  lang: string;

  // display modal edit dialog
  parameters: any[];
  plugin_enabled: boolean;
  parameter_cols: any[];
  rowclicked_foredit: any = false;

  dialog_display: boolean = false;
  dialog_readonly: boolean = false;
  dialog_configname: string;
  dialog_pluginname: string;
  dialog_description: string;

  validation_dialog_display: boolean = false;
  validation_dialog_parameter: string;
  validation_dialog_text: string[];


  constructor(private serverdataService: ServerDataService,
              private dataService: OlddataService,
              private pluginService: PluginService,
              private translate: TranslateService,
              private shared: SharedService) { }


  ngOnInit() {
    console.log('PluginConfigComponent.ngOnInit');

    this.serverdataService.getShngServerinfo()
      .subscribe(
        (response: ServerInfo) => {
          console.log('getShngServerinfo:');
          console.log(response);
          this.server_info = response;
          this.translate.use(this.dataService.getconfigDefaultLanguage());

          this.lang = this.serverdataService.shng_serverinfo.default_language;

          this.pluginService.getPluginConfig().then(pluginconf => { this.pluginconflist = pluginconf;
            console.log(this.pluginconflist);

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
                conf['enabled'] = enabled;
/*
                // get description by loading the metadata of the plugin
                if (plgname.startsWith('plugins.') ) {
                  // remove the beginning of the class-path
                  plgname = plgname.substring(8);
                }
                this.pluginService.getPluginMedatata(plgname).then(meta => { const pluginmetadata = meta;
                  if (pluginmetadata !== null) {
                    console.log('Metadata: lang='+this.lang)
                    console.log(pluginmetadata.plugin.description)
                    const desc = pluginmetadata.plugin.description[this.lang];
                    conf['desc'] = desc;
                  }
                });
*/
                // get description from plugin_config (faster)
//                const desc = this.pluginconflist.plugin_config[plg]['_description'][this.lang];
                const desc = this.pluginconflist.plugin_config[plg]['_description'];
                if (desc !== undefined) {
                  conf['desc'] = desc[this.lang];
                }

                // add to the table of configured plugins
                this.configuredplugins.push(conf);
              }
            }
          });

        },
        (error) => {
          console.log('ERROR: ServicesComponent: dataService.getSchedulerinfo():');
          console.log(error)
        }
      );


    this.cols = [
      { field: 'enabled',  sfield: '',         header: '',                   width:  '30px' },
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
    const desc = meta['plugin']['description'];
    this.dialog_readonly = this.pluginconflist.readonly;
    if (desc !== undefined) {
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

    if (meta['parameters'] !== 'NONE') {
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
              paramdata.value = false;
            } else if (typeof conf[param] === 'boolean') {
              paramdata.value = conf[param];
            } else {
              paramdata.value = (conf[param].toLowerCase() === 'true');
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

      this.restart_core_button = true;

      // transfer to backend server
      this.dataService.setPluginConfig(this.dialog_configname, config);
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


  addPlugin() {
    console.log('PluginConfigComponent.addPlugin:');

    console.error('code for adding plugin is missing!');
    alert('code for adding plugin is missing!');
  }

}

