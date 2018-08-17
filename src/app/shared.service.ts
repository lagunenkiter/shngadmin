
import { Injectable } from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private translate: TranslateService,
              private dataService: DataService) { }


  ageToString(age: number) {
    const days = Math.trunc(age / (24 * 3600));
    age = age - (24 * 3600 * days);
    const hours = Math.trunc(age / 3600);
    age = age - (3600 * hours);
    const minutes = Math.trunc(age / 60);
    age = age - (60 * minutes);
    let seconds = Math.round(100 * age) / 100;
    if (days !== 0) {
      seconds = Math.round(age);
    }

    let result = '';
    if (days !== 0) {
      result += String(days) + ' ';
      if (days === 1) {
        result += this.translate.instant('DAY');
      } else {
        result += this.translate.instant('DAYS');
      }
    }
    if (hours !== 0) {
      if (result !== '') {
        result += ', ';
      }
      result += String(hours) + ' ';
      if (hours === 1) {
        result += this.translate.instant('HOUR');
      } else {
        result += this.translate.instant('HOURS');
      }
    }
    if (minutes !== 0) {
      if (result !== '') {
        result += ', ';
      }
      result += String(minutes) + ' ';
      if (minutes === 1) {
        result += this.translate.instant('MINUTE');
      } else {
        result += this.translate.instant('MINUTES');
      }
    }
    if (seconds !== 0) {
      if (result !== '') {
        result += ', ';
      }
      result += String(seconds) + ' ';
      if (seconds === 1) {
        result += this.translate.instant('SECOND');
      } else {
        result += this.translate.instant('SECONDS');
      }
    }
    return result;
  }


  displayDateTime(datetime) {
    if (datetime) {
      let datew = datetime.split(' ')[0];
      datew = datew.split('-')
      const date = datew[2] + '.' + datew[1] + '.' + datew[0]
      const time = datetime.split(' ')[1].split('.')[0];
      const tz = this.dataService.getconfig('tzname');
      return date + ' ' + time + ' ' + tz;
    } else {
      return datetime;
    }
  }
}
