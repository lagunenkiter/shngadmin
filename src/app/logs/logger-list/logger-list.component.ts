
import { Component, OnInit } from '@angular/core';
import { LoggersType } from '../../common/models/loggers-info';
import { LoggersApiService } from '../../common/services/loggers-api.service';
import {LogsApiService} from '../../common/services/logs-api.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-logger-list',
  templateUrl: './logger-list.component.html',
  styleUrls: ['./logger-list.component.css']
})
export class LoggerListComponent implements OnInit {

  loggers: LoggersType;
  loggersList: any[];

  loggerList: any[];

  levelOptions: {}[] = [{label: 'ERROR', value: 'ERROR'},
    {label: 'WARNING', value: 'WARNING'},
    {label: 'INFO', value: 'INFO'},
    {label: 'DEBUG', value: 'DEBUG'}
  ];
  levelDefault: string = 'WARNING';

  constructor(private dataService: LoggersApiService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    console.log('LoggerListComponent.ngOnInit');

    this.dataService.getLoggers()
      .subscribe(
        (response: LoggersType) => {
          this.loggers = response;
          this.loggersList = Object.keys(this.loggers);
          this.loggersList = this.loggersList.sort();
          console.log('getLoggers', {response});
        }
      );

  }

  baseName(str, withExtension = true) {
    let base = str;
    base = base.substring(base.lastIndexOf('/') + 1);
    if (!withExtension && base.lastIndexOf('.') !== -1) {
      base = base.substring(0, base.lastIndexOf('.'));
    }
    return base;
  }

  levelChanged(logger, level) {
    if (level === null) {
      // console.log('Setting to default');
      this.loggers[logger].active.level = this.levelDefault;
    }
    console.log({logger}, {level}, this.loggers[logger]);
    this.dataService.setLoggerLevel(logger, level)
      .subscribe(
        (response) => {
        }
      );

    this.loggers[logger].level = this.loggers[logger].active.level;
  }

}
