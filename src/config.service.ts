import {Injectable, EventEmitter, OnDestroy} from '@angular/core';

@Injectable()
export class KeepaliveConfig {
  activeInterval?: number;
  idleInterval?: number;
  warnInterval?: number;
  idleOffset?: number;


  pingUrls?: string[];
  pingInterval?: number;
  numberOfRetries?: number;
}