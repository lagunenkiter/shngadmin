
import { Injectable } from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {OlddataService} from './olddata.service';
import {ServerInfo} from '../models/server-info';
import {ServerApiService} from './server-api.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  fallback_language_order: string[];


  constructor(private translate: TranslateService,
              private dataService: OlddataService) { }


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


  // ---------------------------------------------------------
  // Returns a displayable string for a given datetime
  //
  displayDateTime(datetime) {
    if (datetime) {
      let datew = datetime.split(' ')[0];
      datew = datew.split('-');
      const date = datew[2] + '.' + datew[1] + '.' + datew[0];
      const time = datetime.split(' ')[1].split('.')[0];
//      const tz = this.dataService.getconfig('tzname');
      const tz = sessionStorage.getItem('tzname');
      return date + ' ' + time + ' ' + tz;
    } else {
      return datetime;
    }
  }


  // ---------------------------------------------------------

  isInt(value) {
    return /^-{0,1}\d+$/.test(value);
  }


  // ---------------------------------------------------------
  // Checks if the passed string is a valid knx goup address
  //
  //  The checked format is: <main group>/<middle group>/<subgroup>
  //
  //    main group (0-31 = 5 bits)
  //    middle group (0-7 = 3 bits)
  //    subgroup (0-255 = 8 bits)
  //
  is_knx_groupaddress(groupaddress) {
    if (groupaddress === undefined || groupaddress === '') {
      return true;
    }
    const g = groupaddress.split('/');
    if (g.length !== 3) {
      return false;
    }
    if (!(this.isInt(g[0]) && this.isInt(g[1]) && this.isInt(g[2]))) {
      return false;
    }
    if ((Number(g[0]) < 0) || (Number(g[0]) > 31)) {
      return false;
    }
    if ((Number(g[1]) < 0) || (Number(g[1]) > 7)) {
      return false;
    }
    if ((Number(g[2]) < 0) || (Number(g[2]) > 255)) {
      return false;
    }
    return true;
  }


  // ---------------------------------------------------------
  // Checks if the passed string is a valid mac address
  //
  is_mac(mac) {
    mac = String(mac);
    const MACRegex = new RegExp('"^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$');
    return MACRegex.test(mac);
  }


  // ---------------------------------------------------------
  // Checks if the passed string is a valid hostname
  //
  is_hostname(str) {
//    const pattern = new RegExp('(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|', 'i');
    const pattern = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$', 'gm');
    return pattern.test(str);
  }


  // ---------------------------------------------------------
  // Checks if the passed string is a valid ipv4 address
  //
  is_ipv4(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return true;
    }
    return false;

  }


// ---------------------------------------------------------
// Checks if the passed string is a valid ipv6 address
//
  is_ipv6(value) {
    // See https://blogs.msdn.microsoft.com/oldnewthing/20060522-08/?p=31113 and
    // https://4sysops.com/archives/ipv6-tutorial-part-4-ipv6-address-syntax/
    const components = value.split(':');
    if (components.length < 2 || components.length > 8) {
      return false;
    }
    if (components[0] !== '' || components[1] !== '') {
      // Address does not begin with a zero compression ("::")
      if (!components[0].match(/^[\da-f]{1,4}/i)) {
        // Component must contain 1-4 hex characters
        return false;
      }
    }

    let numberOfZeroCompressions = 0;
    for (let i = 1; i < components.length; ++i) {
      if (components[i] === '') {
        // We're inside a zero compression ("::")
        ++numberOfZeroCompressions;
        if (numberOfZeroCompressions > 1) {
          // Zero compression can only occur once in an address
          return false;
        }
        continue;
      }
      if (!components[i].match(/^[\da-f]{1,4}/i)) {
        // Component must contain 1-4 hex characters
        return false;
      }
    }
    return true;
  }


// ---------------------------------------------------------
// getTimeStamp() gets an object with date and time strings
// from an unix timestamp
//
// call: obj = getTimeStamp(new Date(timestamp_as_number))
//
  private zFill(str) {
    if ( Number(str) < 10 ) {
      str = '0' + str;
    }
    return str;
  }

  getTimeStamp(timestamp: Date) {
    const date: Array<String> = [ String(timestamp.getDate()), String(timestamp.getMonth() + 1), String(timestamp.getFullYear()) ];
    // Create an array with the current hour, minute and second
    const time: Array<String> = [ String(timestamp.getHours()), String(timestamp.getMinutes()), String(timestamp.getSeconds())];
    // If seconds and minutes are less than 10, add a zero
    time[1] = this.zFill(time[1]);
    time[2] = this.zFill(time[2]);

    // Return the formatted string
    return {
      date: date.join('.'),
      time: time.join(':')
    };
  }


  // ---------------------------------------------------------
  // getBrowser() gets an object with name and version strings
  // of the used browser
  getBrowser() {
    let ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return {name: 'IE', version: (tem[1] || '')};
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR|Edge\/(\d+)/);
      if (tem != null)   {return {name: 'Opera', version: tem[1]}; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {M.splice(1, 1, tem[1]); }
    return {
      name: M[0],
      version: M[1]
    };
  }


  // ---------------------------------------------------------
  // setGuiLanguage() sets the default language to one of
  // the installed languages
  setGuiLanguage() {
    const installed_languages = ['en', 'de', 'fr'];
    if (installed_languages.indexOf(sessionStorage.getItem('default_language')) > -1 ) {
      this.translate.use(sessionStorage.getItem('default_language'));
    } else {
      console.warn('SharedService.setGuiLanguage', 'language ' + sessionStorage.getItem('default_language') +
                   ' not installed, using ' + installed_languages[0] + ' instead');
      this.translate.use(installed_languages[0]);
      // sessionStorage.setItem('default_language', installed_languages[0]);
    }
  }

  // ---------------------------------------------------------
  // getFallbackLanguage() returns the fallback language
  // (must be 'en' or 'de' (because only those translations
  // have to exist
  getFallbackLanguage(index = 0) {
    this.fallback_language_order = JSON.parse(sessionStorage.getItem('fallback_language_order'));
    // console.log('SharedService.getFallbackLanguage: this.fallback_language_order set to', this.fallback_language_order);
    if (this.fallback_language_order === null) {
      const private_fallback_language_order = ['en', 'de', 'xx'];
      console.warn('SharedService.getFallbackLanguage: private_fallback_language_order, set to', private_fallback_language_order);
      return private_fallback_language_order[index];
    }
    return this.fallback_language_order[index];
  }

  // ---------------------------------------------------------
  // getDescription(descriptionDict) returns the desciption
  // (if neccesary in the fallback language)
  getDescription(descriptionDict) {
    let desc = '';
    if (descriptionDict !== undefined && descriptionDict !== null) {
      desc = descriptionDict[sessionStorage.getItem('default_language')];

      if (desc === undefined || desc === '') {
        // if description in selected language is undefined, use fallback language
        desc = descriptionDict[this.getFallbackLanguage(0)];
        if (desc === undefined || desc === null || desc === '') {
          desc = descriptionDict[this.getFallbackLanguage(1)];
        }
      }
    }
    return desc;
  }
}
