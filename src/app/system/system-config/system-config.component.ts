
import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import {ConfigApiService} from '../../common/services/config-api.service';
import {SchedulersApiService} from '../../common/services/schedulers-api.service';
import {ServerApiService} from '../../common/services/server-api.service';

import { SharedService } from '../../common/services/shared.service';

import {sha512} from 'js-sha512';


@Component({
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css']
})

export class SystemConfigComponent implements OnInit {

  config: any;
  lang: string;

  common_parameters: any[];
  common_parameter_cols: any[];
  common_parameters_beforeEdit: any[];

  http_parameters: any[];
  http_parameter_cols: any[];
  http_parameters_beforeEdit: any[];

  admin_parameters: any[];
  admin_parameter_cols: any[];
  admin_parameters_beforeEdit: any[];

  data_changed: boolean = false;
  restart_core_button = false;

  rowclicked_foredit: any = false;
  dialog_readonly: boolean = false;



  pwd_change_dialog_display = false;
  pwd_rowData: any;
  pwd_col: any;

  pwd_old: string = null;
  pwd_new1: string = null;
  pwd_new2: string = null;
  pwd_hash_old: string = null;
  pwd_hash_new: string = null;
  pwd_show: boolean;

  pwd_old_is_empty: boolean;
  pwd_old_is_wrong: boolean;
  pwd_new_not_identical: boolean;

  validation_dialog_display: boolean = false;
  validation_dialog_parameter: string;
  validation_dialog_text: string[];


  constructor(private dataService: ConfigApiService,
              private dataServiceServer: ServerApiService,
              private shared: SharedService,
              private translate: TranslateService) { }


  ngOnInit() {
    console.log('SystemConfigComponent.ngOnInit');

    this.dataService.getConfig()
      .subscribe(
        (response) => {
          this.config = response;
//          this.schedulerinfo.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)});
          console.log('getConfig', {response});
          this.fillDialodData();
        }
      );

  }


  fillDialodData() {
    this.fillCommonDialogData();
    this.fillHttpDialogData();
    this.fillAdminDialogData();
  }


  // ---------------------------------------------------------
  // Fill the mask with core parameter data
  //
  fillCommonDialogData() {
    this.lang = sessionStorage.getItem('default_language');

    this.common_parameter_cols = [
      {field: 'name', sfield: 'confname', header: 'PLUGIN.PARAMETER', width: '190px', iwidth: '186px'},
      {field: 'value', sfield: 'paramvalue', header: 'PLUGIN.VALUE', width: '200px', iwidth: '196px'},
      {field: 'type', sfield: 'conftype', header: 'PLUGIN.TYPE', width: '100px', iwidth: '96px'},
      {field: 'desc', sfield: '', header: 'PLUGIN.DESCRIPTION', width: '', iwidth: ''}
    ];

    this.common_parameters = [];

    const meta = this.config.common.meta;
    const data = this.config.common.data;

    for (const param in meta.parameters) {
      if (meta.parameters.hasOwnProperty(param)) {

        // fill valuelist
        const vl = [];
        if (meta['parameters'][param]['valid_list'] !== undefined) {
          let wrk = {};
          for (let i = 0; i < meta['parameters'][param]['valid_list'].length; i++) {
            wrk = {label: String(meta['parameters'][param]['valid_list'][i]), value: meta['parameters'][param]['valid_list'][i]};
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
        let paramdesc = '';
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
          'value': data[param],
          'desc': paramdesc
        };

        if (paramdata.value === undefined) {
          paramdata.value = null;
        }
        // add to the table of configured plugins
        this.common_parameters.push(paramdata);

      }
    }
    // deepcopy form data
    this.common_parameters_beforeEdit = JSON.parse(JSON.stringify(this.common_parameters));
  }

  // ---------------------------------------------------------
  // Fill the mask with http parameter data
  //
  fillHttpDialogData() {
    this.lang = sessionStorage.getItem('default_language');

    this.http_parameter_cols = [
      {field: 'name', sfield: 'confname', header: 'PLUGIN.PARAMETER', width: '190px', iwidth: '186px'},
      {field: 'value', sfield: 'paramvalue', header: 'PLUGIN.VALUE', width: '200px', iwidth: '196px'},
      {field: 'type', sfield: 'conftype', header: 'PLUGIN.TYPE', width: '100px', iwidth: '96px'},
      {field: 'desc', sfield: '', header: 'PLUGIN.DESCRIPTION', width: '', iwidth: ''}
    ];

    this.http_parameters = [];

    const meta = this.config.http.meta;
    const data = this.config.http.data;

    // if plain password is defined, create a hashed password and delete the plain password
    if (data.password !== undefined && data.password !== null) {
      if (data.password !== '') {
        if (data.hashed_password === undefined || data.hashed_password === null || data.hashed_password === '') {
          data.hashed_password = sha512(data.password);
          data.password = null;
        }
      }
    }

    // if plain service-password is defined, create a hashed service-password and delete the plain service-password
    if (data.service_password !== undefined && data.service_password !== null) {
      if (data.service_password !== '') {
        if (data.service_hashed_password === undefined || data.service_hashed_password === null || data.service_hashed_password === '') {
          data.service_hashed_password = sha512(data.service_password);
          data.service_password = null;
        }
      }
    }

    for (const param in meta.parameters) {
      if (meta.parameters.hasOwnProperty(param)) {

        // ignore plain text password fields
        if (['password', 'service_password'].indexOf(param) === -1) {
          // fill valuelist
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
          let paramdesc = '';
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
            'value': data[param],
            'desc': paramdesc};

          if (paramdata.value === undefined) {
            paramdata.value = null;
          }
          // add to the table of configured plugins
          this.http_parameters.push(paramdata);
        }

      }
    }
    // deepcopy form data
    this.http_parameters_beforeEdit = JSON.parse(JSON.stringify(this.http_parameters));

  }

  // ---------------------------------------------------------
  // Fill the mask with http parameter data
  //
  fillAdminDialogData() {
    this.lang = sessionStorage.getItem('default_language');

    this.admin_parameter_cols = [
      {field: 'name', sfield: 'confname', header: 'PLUGIN.PARAMETER', width: '190px', iwidth: '186px'},
      {field: 'value', sfield: 'paramvalue', header: 'PLUGIN.VALUE', width: '200px', iwidth: '196px'},
      {field: 'type', sfield: 'conftype', header: 'PLUGIN.TYPE', width: '100px', iwidth: '96px'},
      {field: 'desc', sfield: '', header: 'PLUGIN.DESCRIPTION', width: '', iwidth: ''}
    ];

    this.admin_parameters = [];

    const meta = this.config.admin.meta;
    const data = this.config.admin.data;

    for (const param in meta.parameters) {
      if (meta.parameters.hasOwnProperty(param)) {

        // fill valuelist
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
        let paramdesc = '';
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
          'value': data[param],
          'desc': paramdesc};

        if (paramdata.value === undefined) {
          paramdata.value = null;
        }
        // add to the table of configured plugins
        this.admin_parameters.push(paramdata);

      }
    }
    // deepcopy form data
    this.admin_parameters_beforeEdit = JSON.parse(JSON.stringify(this.admin_parameters));

  }


  // ---------------------------------------------------------
  // change password
  //
  change_password_dialog($event, rowData, col_field) {
    console.log('change_password_dialog()');
    console.log('hash', rowData[col_field]);
    this.pwd_hash_old = rowData[col_field];
    this.pwd_rowData = rowData;
    this.pwd_col = col_field;

    this.pwd_old = null;
    this.pwd_new1 = null;
    this.pwd_new2 = null;
    this.pwd_old_is_wrong = false;
    this.pwd_change_dialog_display = true;
  }


  change_password($event) {
    console.log('change_password()');
    this.pwd_old_is_empty = false;
    this.pwd_old_is_wrong = false;
    this.pwd_new_not_identical = false;

    if (this.pwd_hash_old !== null) {
      if (this.pwd_old === null || this.pwd_old === '') {
        this.pwd_old_is_empty = true;
        return;
      }

      // const wrk = sha512(this.pwd_old);
      if (this.pwd_hash_old !== sha512(this.pwd_old)) {
        this.pwd_old_is_wrong = true;
        return;
      }
    }
    if (this.pwd_new1 !== this.pwd_new2) {
      this.pwd_new_not_identical = true;
      return;
    }

    console.log('pwd_new1', this.pwd_new1);
    console.log('pwd_new2', this.pwd_new2);

    this.pwd_hash_new = null;
    if (this.pwd_new1 !== null) {
      this.pwd_hash_new = sha512(this.pwd_new1);
    }
    console.log('pwd_hash_new', this.pwd_hash_new);

    this.pwd_rowData[this.pwd_col] = this.pwd_hash_new;
    this.pwd_change_dialog_display = false;
    this.check_values();
  }

  check_values() {
    this.data_changed = false;
    for (const p in this.common_parameters) {
      if (this.common_parameters.hasOwnProperty(p)) {
        if (this.common_parameters[p].value !== this.common_parameters_beforeEdit[p].value) {
          this.data_changed = true;
          // console.log(this.common_parameters[p]);
        }
      }
    }
    for (const p in this.http_parameters) {
      if (this.http_parameters.hasOwnProperty(p)) {
        if (this.http_parameters[p].value !== this.http_parameters_beforeEdit[p].value) {
          this.data_changed = true;
          // console.log(this.http_parameters[p]);
        }
      }
    }
    for (const p in this.admin_parameters) {
      if (this.admin_parameters.hasOwnProperty(p)) {
        if (this.admin_parameters[p].value !== this.admin_parameters_beforeEdit[p].value) {
          this.data_changed = true;
          // console.log(this.admin_parameters[p]);
        }
      }
    }
  }


  check_value_restrictions(parameter) {
    let error_found = false;
    let error_text = '';

    console.log('check_value_restrictions', {parameter});

    if (parameter['value'] === undefined) { parameter['value'] = null; }

    // checking data types
    if (parameter['value'] !== null && parameter['value'] !== '') {
      error_text = '\'' + parameter['value'] + '\' '  ;
      if (parameter['type'].toLowerCase() === 'knx_ga' && !this.shared.is_knx_groupaddress(parameter['value'])) {
        error_found = true;
        error_text += this.translate.instant('PLUGIN.INVALID_KNX_ADDRESS');
      }
      if (parameter['type'].toLowerCase() === 'mac' && !this.shared.is_mac(parameter['value'])) {
        error_found = true;
        error_text += this.translate.instant('PLUGIN.INVALID_MAC_ADDRESS');
      }
      if (parameter['type'].toLowerCase() === 'ipv4' && !this.shared.is_ipv4(parameter['value'])) {
        error_found = true;
        error_text += this.translate.instant('PLUGIN.INVALID_IP_ADDRESS') + ' (v4)';
      }
      if (parameter['type'].toLowerCase() === 'ipv6' && !this.shared.is_ipv6(parameter['value'])) {
        error_found = true;
        error_text += this.translate.instant('PLUGIN.INVALID_IP_ADDRESS') + ' (v6)';
      }
      if (parameter['type'].toLowerCase() === 'ip') {
        if (!this.shared.is_ipv4(parameter['value']) && !this.shared.is_ipv6(parameter['value'])) {
          if (!this.shared.is_hostname(parameter['value'])) {
            error_found = true;
            error_text += this.translate.instant('PLUGIN.INVALID_HOSTNAME');
          }
        }
      }
    }

    // check valid minimum and maximum value
    if ((parameter['value'] !== null) && (parameter['value'] < parameter['valid_min'])) {
      error_found = true;
      error_text = this.translate.instant('PLUGIN.DEFINED_MIN') + ' \'' + parameter['valid_min'] + '\'';
      error_text += ', ' + this.translate.instant('PLUGIN.ACTUAL_VALUE') + ' \'' + parameter['value'] + '\'';
    }
    if ((parameter['value'] !== null) && (parameter['value'] > parameter['valid_max'])) {
      error_found = true;
      error_text = this.translate.instant('PLUGIN.DEFINED_MAX') + ' \'' + parameter['valid_max'] + '\'';
      error_text += ', ' + this.translate.instant('PLUGIN.ACTUAL_VALUE') + ' \'' + parameter['value'] + '\'';
    }

    // check if value is mandantory
    if ((parameter['value'] === null || parameter['value'] === '') && parameter['mandatory']) {
      error_found = true;
      error_text = this.translate.instant('PLUGIN.MANDATORY_VALUE');
    }

    if (error_found) {
      this.validation_dialog_text.push(this.translate.instant('PLUGIN.PARAMETER') + ' \'' + parameter['name'] + '\': ' + error_text);
      this.validation_dialog_parameter = parameter['name'];

      this.validation_dialog_display = true;
      console.warn('Parameter ' + '\'' + parameter['name'] + '\'', error_text);
      return false;
    }
    return true;
  }


  saveSettings() {
    let errors_found = false;
    this.validation_dialog_text = [];


    for (const p in this.common_parameters) {
      if (this.common_parameters.hasOwnProperty(p)) {
        if (!this.check_value_restrictions(this.common_parameters[p])) {
          errors_found = true;
        }
      }
    }
    for (const p in this.http_parameters) {
      if (this.http_parameters.hasOwnProperty(p)) {
        if (!this.check_value_restrictions(this.http_parameters[p])) {
          errors_found = true;
        }
      }
    }
    for (const p in this.admin_parameters) {
      if (this.admin_parameters.hasOwnProperty(p)) {
        if (!this.check_value_restrictions(this.admin_parameters[p])) {
          errors_found = true;
        }
      }
    }


    if (errors_found) {
      return false;
    }


    const data = {};
    data['common'] = {};
    data['common']['data'] = {};
    for (const p in this.common_parameters) {
      if (this.common_parameters.hasOwnProperty(p)) {
        data['common']['data'][this.common_parameters[p].name] = this.common_parameters[p].value;
      }
    }

    data['http'] = {};
    data['http']['data'] = {};
    for (const p in this.http_parameters) {
      if (this.http_parameters.hasOwnProperty(p)) {
        data['http']['data'][this.http_parameters[p].name] = this.http_parameters[p].value;
      }
    }
    // remove plain passwords
    data['http']['data']['password'] = null;
    data['http']['data']['service_password'] = null;

    data['admin'] = {};
    data['admin']['data'] = {};
    for (const p in this.admin_parameters) {
      if (this.common_parameters.hasOwnProperty(p)) {
        data['admin']['data'][this.admin_parameters[p].name] = this.admin_parameters[p].value;
      }
    }


    this.dataService.saveConfig(data)
      .subscribe((result: boolean) => {
        if (result) {
          console.log('saveSettings', 'success');

          this.common_parameters_beforeEdit = JSON.parse(JSON.stringify(this.common_parameters));
          this.http_parameters_beforeEdit = JSON.parse(JSON.stringify(this.http_parameters));
          this.admin_parameters_beforeEdit = JSON.parse(JSON.stringify(this.admin_parameters));

          this.data_changed = false;
          this.restart_core_button = true;
        } else {
          console.warn('saveSettings', 'fail');
        }
      });

  }



  restartShng() {
    this.dataServiceServer.restartShngServer()
      .subscribe(
        (response) => {
          const res = <any> response;
          console.log('restartShng', res.result);
        }
      );
    this.restart_core_button = false;
  }
}
