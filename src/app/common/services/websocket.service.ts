
import { Injectable } from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';


// @Injectable({
//   providedIn: 'root'
// })

@Injectable()
export class WebsocketService {
  private subject: Subject<any>;
  public ws: any;

  constructor() { }


  public connect(url: string): Subject<any> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }


  private create(url: string): Subject<any> {
    this.ws = new WebSocket(url);
    const observable = Observable.create(
      (obs: Observer<any>) => {
        console.warn('Websocket connection to ' + url + ' created.');
        this.ws.onmessage = obs.next.bind(obs);
        this.ws.onerror = obs.error.bind(obs);
        this.ws.onclose = obs.complete.bind(obs);
        return this.ws.close.bind(this.ws);
      });

    const observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }


  public sendMessage(message: any) {
    this.subject.next(message);
  }


  public close() {
    if (this.ws) {
      this.ws.close();
      this.subject = null;
      console.warn('Websocket connection closed.');
    }
  }
}


