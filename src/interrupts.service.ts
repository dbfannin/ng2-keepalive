import {Injectable, EventEmitter, OnDestroy} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

@Injectable()
export class InterruptsService implements OnDestroy {

  constructor() {
  }


  private running: boolean = false;

  private clickListener: Subscription;
  private wheelListener: Subscription;
  private mouseMoveListener: Subscription;
  private keyPressListener: Subscription;

  interruptEvent: EventEmitter<any> = new EventEmitter();


  start() {
    this.running = true;
    this.clickListener = Observable.fromEvent(document, 'click').debounceTime(200).subscribe(event => this.onInterrupt());
    this.wheelListener = Observable.fromEvent(document, 'wheel').debounceTime(200).subscribe(event => this.onInterrupt());
    this.mouseMoveListener = Observable.fromEvent(document, 'mousemove').debounceTime(200).subscribe(event => this.onInterrupt());
    this.keyPressListener = Observable.fromEvent(document, 'keydown').debounceTime(200).subscribe(event => this.onInterrupt());
  }

  stop() {
    this.running = false;
    if(this.clickListener) this.clickListener.unsubscribe();
    if(this.wheelListener) this.wheelListener.unsubscribe();
    if(this.mouseMoveListener) this.mouseMoveListener.unsubscribe();
    if(this.keyPressListener) this.keyPressListener.unsubscribe();
  }

  onInterrupt() {
    if(!this.running) return;
    this.interruptEvent.emit(null);
  }

  ngOnDestroy() {
    this.stop();
  }

}
