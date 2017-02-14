import {Injectable, EventEmitter, OnDestroy} from '@angular/core';
import {PingService} from './ping.service';
import {InterruptsService} from './interrupts.service';
import {NG2Logger} from 'ng2.logger'
import {KeepaliveConfig} from './config.service'


@Injectable()
export class IdleService implements OnDestroy {
  constructor(private pingService: PingService, private interruptService: InterruptsService, private logger: NG2Logger, private internal: KeepaliveConfig) {

    this.activeTimeout = this.internal.activeInterval;
    this.idleTimeout = this.internal.idleInterval;
    this.warnTimeout = this.internal.warnInterval;


    this.pingService.start();
    this.pingService.onPingResponse.subscribe((res) => this.ping(res))
  }

  state: string;
  header: string;
  message: string;
  countdown: number;

  private running: boolean = false;

  private activeHandle: any;
  private idleHandle: any;
  private warnHandle: any;

  private activeTimeout: number;
  private idleTimeout: number;
  private warnTimeout: number;

  private States = {
    active: 'ACTIVE',
    idle: 'IDLE',
    warn: 'WARN',
    expired: 'EXPIRED'
  };


  onInterrupt: EventEmitter<number> = new EventEmitter();


  onStateChange: EventEmitter<any> = new EventEmitter();
  onCountdownChange: EventEmitter<any> = new EventEmitter();


  reset(idleInterval?: number) {
    this.running = true;

    this.safeClearInterval('activeHandle');
    this.safeClearInterval('idleHandle');
    this.safeClearInterval('warnHandle');

    this.activeTimeout = this.internal.activeInterval;
    this.idleTimeout = idleInterval || this.internal.idleInterval;
    this.warnTimeout = this.internal.warnInterval;

    this.startActiveTimeout();
  }


  start() {
    this.reset();

    this.interruptService.stop();
    this.interruptService.start();

    this.interruptService.interruptEvent.subscribe(() => {
      this.interrupt()
    });
  }

  stop() {
    this.running = false;

    this.safeClearInterval('activeHandle');
    this.safeClearInterval('idleHandle');
    this.safeClearInterval('warnHandle');

    this.interruptService.stop();
    this.pingService.stop();
  }

  interrupt(): void {
    if (!this.running)  return;

    this.onInterrupt.emit();

    this.reset();
  }

  private ping = (response) => {
    if (this.state === 'EXPIRED') return;

    if (response.error || !response.ttl) {
      return this.expire();
    }

    let ttl = response.ttl - this.internal.idleOffset;


    this.logger.trace(`TTL: ${ttl}`);

    this.safeClearInterval('activeHandle');
    this.safeClearInterval('idleHandle');
    this.safeClearInterval('warnHandle');


    if (ttl < 0) {
      //expired
      return this.expire();

    } else if (ttl <= this.internal.warnInterval) {
      //WARN

      this.warnTimeout = ttl;

      return this.startWarnTimeout();
    } else {
      //active

      //set the new idle timeout as the ttl-warninterval-activeinterval
      this.reset(ttl - this.internal.warnInterval - this.internal.activeInterval);
    }
  };

  private startActiveTimeout() {
    this.state = this.States.active;
    this.pingService.setIsIdling(false);
    this.onStateChange.emit(this.state);

    this.activeHandle = setTimeout(() => {
      this.startIdleTimeout();
    }, this.activeTimeout * 1000);

  }

  private startIdleTimeout() {
    this.state = this.States.idle;
    this.onStateChange.emit(this.state);

    this.idleHandle = setTimeout(() => {
      this.startWarnTimeout();
    }, this.idleTimeout * 1000);
  }

  private startWarnTimeout() {
    this.state = this.States.warn;
    this.onStateChange.emit(this.state);


    this.countdown = this.warnTimeout;
    this.doCountdown();

  }

  private safeClearInterval(handleName: string): void {
    if (this[handleName]) {
      clearInterval(this[handleName]);
      this[handleName] = null;
    }
  }

  private doCountdown(): void {
    if (!this.running) return;

    this.onCountdownChange.emit(this.countdown);
    this.logger.trace(`countdown ${this.countdown}`);

    if (this.countdown <= 0) {


      return this.expire();
    }

    this.countdown--;

    this.warnHandle = setTimeout(() => {
      this.doCountdown();
    }, 1000);
  }

  private expire() {
    this.state = this.States.expired;
    this.onStateChange.emit(this.state);
    this.stop();
  }

  /*
   * Called by Angular when destroying the instance.
   */
  ngOnDestroy(): void {
    this.stop();
  }


}
