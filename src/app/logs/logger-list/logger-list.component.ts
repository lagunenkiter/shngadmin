import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logger-list',
  templateUrl: './logger-list.component.html',
  styleUrls: ['./logger-list.component.css']
})
export class LoggerListComponent implements OnInit {

  loggerList: any[];


  constructor() { }

  ngOnInit() {
    console.log('LoggerListComponent.ngOnInit');

    this.loggerList = [
      {
        name: 'root',
        disabled: 'false',
        level: 'WARNING',
        filters: [],
        handlers: ['TimedRotatingFileHandler', '_LogHandler'],
        filenames: ['/usr/local/shng_dev/var/log/smarthome-warnings.log ']
      },
      {
        name: '__main__',
        disabled: 'false',
        level: 'WARNING',
        filters: [],
        handlers: ['TimedRotatingFileHandler', 'TimedRotatingFileHandler', 'TimedRotatingFileHandler', 'TimedRotatingFileHandler'],
        filenames: ['/usr/local/shng_dev/var/log/smarthome-details.log', '/usr/local/shng_dev/var/log/q21-items.log', '/usr/local/shng_dev/var/log/q21-wetter.log', '/usr/local/shng_dev/var/log/smarthome-warnings.log ']
      }
    ];
  }

  baseName(str, withExtension = true) {
    let base = str;
    base = base.substring(base.lastIndexOf('/') + 1);
    if (!withExtension && base.lastIndexOf('.') !== -1) {
      base = base.substring(0, base.lastIndexOf('.'));
    }
    return base;
  }
}

