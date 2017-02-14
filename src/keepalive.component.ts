import {Component, OnInit, ViewChild} from '@angular/core';
import {IdleService} from './idle.service';
import {ModalDirective} from "ng2-bootstrap";
import {NG2Logger} from 'ng2.logger';

@Component({
  selector: 'ng2-keepalive',
  template: `
<div class="modal fade" bsModal #keepaliveModal="bs-modal" [config]="{backdrop: 'static', ignoreBackdropClick: false}"
     tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">

      <div class="modal-header">
        <h4 class="modal-title">{{states[curState].header}}</h4>
        <button type="button" class="close" aria-label="Close" (click)="close()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>{{states[curState].message | stringreplace:countdown }}</p>
      </div>
    </div>
  </div>
</div>`,
  styleUrls: []
})
export class KeepaliveComponent implements OnInit {

  constructor(private idleService: IdleService, private logger: NG2Logger) {
  }


  @ViewChild('keepaliveModal') public keepaliveModal: ModalDirective;
  public curState: string = 'ACTIVE';
  public countdown: number;

  states =
      {
        ACTIVE: {
          message: '',
          header: ''
        },
        IDLE: {
          message: '',
          header: ''
        },
        WARN: {
          header: 'Session Idle',
          message: `Your session has been idle over its time limit. You'll be logged out in %s second(s).`
        },
        EXPIRED: {
          header: 'Session Expired',
          message: 'Your session has expired. You have been logged out.'
        }
      };

  open() {
    this.keepaliveModal.show();
  }

  close() {
    this.keepaliveModal.hide();
  }

  ngOnInit() {
    this.idleService.start();

    this.curState = this.idleService.state;

    this.idleService.onStateChange.subscribe((newState) => {
      if (newState === this.curState) return;

      this.logger.trace(`state change ${newState}`);
      this.curState = newState;

      if (this.curState === 'EXPIRED' || this.curState === 'WARN') {
        this.open();
      } else if (this.curState === 'ACTIVE') {
        this.countdown = null;
        this.close();
      } else {
      }
    });

    this.idleService.onCountdownChange.subscribe((countdown) => {
      this.countdown = countdown;
    });
    // this.idleService.onInterrupt.subscribe((changeObj) => {
    // });

    this.keepaliveModal.onHide.subscribe(() => {
      this.logger.trace('Expired modal hidden');

      if (this.curState == 'EXPIRED') {
        //  TODO: if expired logout
      }
    });
  }
}
