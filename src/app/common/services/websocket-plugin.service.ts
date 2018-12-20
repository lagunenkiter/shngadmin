
import { Injectable, OnInit } from '@angular/core';

import { Subject, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket'; // for RxJS 6, for v5 use Observable.webSocket

// import { SystemComponent } from '../system/system.component';

import { WebsocketService } from './websocket.service';
import { SharedService } from './shared.service';
import {OlddataService} from './olddata.service';


// const PLUGIN_URL = 'ws://smarthomeng.fritz.box:2424/';


export interface Message {
  cmd: string;
  id?: string;
  val?: string;
  items?: string[];
  item?: string;
  series?: string;
  start?: string;
  end?: string;
  count?: number;
  sw?: string;
  ver?: string;
  browser?: string;
  bver?: string;
  rawdata: any;
}


type SeriesCallback = ( series: any ) => void;


// ------------------------------------------------------------------

@Injectable({
  providedIn: 'root'
})

// @Injectable()
export class WebsocketPluginService implements OnInit {
  public messages: Subject<Message>;

  wsService: any;
  subject: any;

  private msgListenSeriesLoad = <Message> {
    'cmd': 'series',
    'item': 'env.system.load',
    'series': 'avg',
    'start': '48h',
    'end': 'now',
    'count': 10
  };
  private msgListenSeriesMemory = <Message> {
    'cmd': 'series',
    'item': 'env.core.memory',
    'series': 'avg',
    'start': '48h',
    'end': 'now',
    'count': 10
  };
  private msgListenSeriesThreads = <Message> {
    'cmd': 'series',
    'item': 'env.core.threads',
    'series': 'avg',
    'start': '48h',
    'end': 'now',
    'count': 20
  };
  private msgListenSeriesDisk = <Message> {
    'cmd': 'series',
    'item': 'env.system.diskusagepercent',
    'series': 'avg',
    'start': '48h',
    'end': 'now',
    'count': 10
  };


  systemload = {
    'series': [],
    'tsdiff': 0,
  };

  memory = {
    'series': [],
    'tsdiff': 0,
  };

  threads = {
    'series': [],
    'tsdiff': 0,
  };

  disk = {
    'series': [],
    'tsdiff': 0,
  };


  private systemloadSource = new Subject<void>();
  public systemloadUpdate$ = this.systemloadSource.asObservable();

  private memorySource = new Subject<void>();
  public memoryUpdate$ = this.memorySource.asObservable();

  private threadsSource = new Subject<void>();
  public threadsUpdate$ = this.threadsSource.asObservable();

  private diskSource = new Subject<void>();
  public diskUpdate$ = this.diskSource.asObservable();


  constructor(private dataService: OlddataService,
              private websocketService: WebsocketService,
              private shared: SharedService) {
  }

  firstMsgSent = false;
  msgIdentity = <Message> {
    cmd: 'identity',
    sw: 'shngAdmin',
    ver: 'v0.2.1',
    browser: 'y',
    bver: ''
  };


  ngOnInit() {
  }


  async delay(ms: number, msg: string) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then( () => {
//      console.log('fired ' + msg)
    });
  }


  connect() {
    let host = this.dataService.getHostIp();
    // for testing
    if (host === 'localhost') {
      host = 'smarthomeng.fritz.box';
    }
    const plugin_url = 'ws://' + host + ':' + this.dataService.getWsPort();
//    const plugin_url = 'ws://smarthomeng.fritz.box:2424/';
    console.log({plugin_url})
    this.wsService = new WebsocketService();
    this.subject = this.wsService.connect(plugin_url);
    this.subject.subscribe(msg => {
        const data = JSON.parse(msg.data);
        if (data.cmd === 'item') {
          this.handleResponseItem(data);
        } else if (data.cmd === 'series') {
          this.handleResponseSeries(data);
        } else {
          console.log('message received :');
          console.log(data);
        }
      },
      (err) => console.log(err),
    );

    if (this.firstMsgSent) {
      this.wsService.sendMessage(this.msgIdentity);
    } else {
      this.delay(500, 'msgIdentity').then(any => {
        const browser = this.shared.getBrowser();
        this.msgIdentity.browser = browser.name;
        this.msgIdentity.bver = browser.version;
        // task after delay.
        this.wsService.sendMessage(this.msgIdentity);
        this.firstMsgSent = true;
      });
    }
  }


  handleResponseItem(data) {
    console.log('message received (item):');
    console.log(data);
  }


  sendMessage(message: any) {
    if (this.firstMsgSent) {
      this.wsService.sendMessage(message);
    } else {
      this.delay(500, message.item).then(any => {
        // task after delay.
        this.wsService.sendMessage(message);
      });
    }
  }


  // ------------------------------------------------------------------
  // requests series for load, memory and threads
  //

  getSeriesLoad(period = '24h', count = 100) {
    this.msgListenSeriesLoad.start = period;
    this.msgListenSeriesLoad.count = count;
    this.sendMessage(this.msgListenSeriesLoad);
  }


  getSeriesMemory(period = '24h', count = 100) {
    this.msgListenSeriesMemory.start = period;
    this.msgListenSeriesMemory.count = count;
    this.sendMessage(this.msgListenSeriesMemory);
  }


  getSeriesThreads(period = '24h', count = 100) {
    this.msgListenSeriesThreads.start = period;
    this.msgListenSeriesThreads.count = count;
    this.sendMessage(this.msgListenSeriesThreads);
  }


  getSeriesDisk(period = '24h', count = 100) {
    // this.msgListenSeriesDisk.item = 'env.system.diskfree';
    this.msgListenSeriesDisk.start = period;
    this.msgListenSeriesDisk.count = count;
    this.sendMessage(this.msgListenSeriesDisk);
  }


  // ------------------------------------------------------------------
  // Handle responses to series requests
  //

  convertTimestamps(data) {
    // for each value pair: Create a string value for each timpestamp and append it to the array
    for (let i = 0; i < data.series.length; i++) {
      data.series[i].push(this.shared.getTimeStamp(new Date(data.series[i][0])));
      // console.log(data.series[i]);
    }
  }


  convertMemorysize(data) {
    // for each value pair: Create a string value for each timpestamp and append it to the array
    for (let i = 0; i < data.series.length; i++) {
      data.series[i][1] = data.series[i][1] / 1000 / 1000;
    }
  }


  updateSeries(graphdata, data) {
    if (graphdata.series.length === 0) {
      // calculate the difference between oldest and newest timestamp
      const tstampDiff = data.series[data.series.length - 1][0] - data.series[0][0];
      graphdata.tsdiff = tstampDiff;
    } else {
      const tstampNow = new Date().getTime();
      // calculate oldest valid timestamp
      const tstampOldest = tstampNow - graphdata.tsdiff;

      // remove value pairs that are older then the oldest valid timestamp
//      console.log('Remove old value-pairs:');
//      console.log(graphdata);
      // leave one value that is older than oldest valid timestamp
      let tmp = tstampOldest - graphdata.series[1][0];
      while (graphdata.series[1][0] < tstampOldest) {
        graphdata.series.shift();
        tmp = tstampOldest - graphdata.series[1][0];
      }
      graphdata.series[0][0] = tstampOldest;
//      console.log(graphdata);
    }

    // append value pairs to existing series of data
    graphdata.series.push.apply(graphdata.series, data.series);
    return;
  }


  handleResponseSeries(data) {
//    console.warn('handleResponseSeries');
//    console.log(data);
    if (data.sid.startsWith(this.msgListenSeriesMemory.item)) {
      this.convertMemorysize(data);
    }
    this.convertTimestamps(data);
    if (data.sid.startsWith(this.msgListenSeriesLoad.item)) {
      // console.log('message received (load-series):');
      this.updateSeries(this.systemload, data);
      this.systemloadSource.next();

    } else if (data.sid.startsWith(this.msgListenSeriesMemory.item)) {
      // console.log('message received (memory-series):');
      this.updateSeries(this.memory, data);
      this.memorySource.next();

    } else if (data.sid.startsWith(this.msgListenSeriesThreads.item)) {
      // console.log('message received (threads-series):');
      this.updateSeries(this.threads, data);
      this.threadsSource.next();

    } else if (data.sid.startsWith(this.msgListenSeriesDisk.item)) {
      // console.log('message received (disk-series):');
      this.updateSeries(this.disk, data);
      this.diskSource.next();

    } else {
      console.warn('message received (UNKNOWN series):');
      console.log(data);
     }
  }

}

