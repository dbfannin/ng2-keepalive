/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KeepaliveComponent } from './keepalive.component';

describe('KeepaliveComponent', () => {
  let component: KeepaliveComponent;
  let fixture: ComponentFixture<KeepaliveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeepaliveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeepaliveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
