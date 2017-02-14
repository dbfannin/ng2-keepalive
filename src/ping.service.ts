import {Injectable, EventEmitter, OnDestroy, Input} from '@angular/core';
import {KeepaliveConfig} from './config.service';
import {Http} from '@angular/http';
import * as _ from "lodash";


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class PingService implements OnDestroy {
  private pingHandle: any;
  private pingUrls: string[];
  private isIdling: boolean = true;

  private pingInterval: number;
  private numberOfRetries: number;

  public onPingResponse: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http, private internal: KeepaliveConfig) {
    this.pingInterval = this.internal.pingInterval || 15;
    this.pingUrls = this.internal.pingUrls || ['/ping'];
    this.numberOfRetries = this.internal.numberOfRetries || 5;
  };

  public setIsIdling(idling) {
    this.isIdling = idling;
  }

  private _ping(url) {
    let randomNumber = Math.floor(Math.random() * 99999999);


    //activity since last ping
    url = this.isIdling ? `${url}?${randomNumber}` : `${url}?extend=true&${randomNumber}`;
    this.http.get(url)
      .map(res => res.json())
      .catch(error => error).subscribe(res => this.onPingSuccess(res, url), error => this.onError(error, url));
  }

  public ping() {
    _.each(this.pingUrls, (url) => {
      this._ping(url);
    });
  };

  private onPingSuccess(res, url) {

    if(!res.ttl){
      return this.onError({error: 'Invalid Response'}, url);
    }

    //gives time for all requests to be called before updating isIdle
    setTimeout(()=>{
      this.isIdling = true;
    }, 500);

    this.numberOfRetries = this.internal.numberOfRetries;
    this.onPingResponse.emit(res);
  }

  private onError(error, url) {
    if (this.numberOfRetries <= 0) {
      return this.onPingResponse.emit({error: error})
    }

    this.numberOfRetries--;
    setTimeout(() => {
      this._ping(url);
    }, 2000);
  }

  public start() {
    this.numberOfRetries = this.internal.numberOfRetries;
    this.stop();

    this.pingHandle = setInterval(() => {
      this.ping();
    }, this.pingInterval * 1000);
  };

  public stop() {
    clearInterval(this.pingHandle);
    this.pingHandle = null;
  };

  public ngOnDestroy() {
    this.stop();
  };

  public isRunning() {
    return !!this.pingInterval;
  };
}
