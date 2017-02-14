import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IdleService} from './idle.service';
import {ModalModule} from 'ng2-bootstrap/modal';

import {PingService} from './ping.service';

import{KeepaliveComponent} from './keepalive.component'
import {InterruptsService} from "./interrupts.service";
import {KeepaliveConfig} from "./config.service";
import {StringreplacePipe} from './stringreplace.pipe';


@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  declarations: [KeepaliveComponent, StringreplacePipe],
  exports: [KeepaliveComponent]
})
export class KeepaliveModule {
  static forRoot(config: KeepaliveConfig) {
    return {
      ngModule: KeepaliveModule,
      providers: [
        IdleService,
        PingService,
        InterruptsService,
        {provide: KeepaliveConfig, useValue: config}
      ]
    };
  }
}