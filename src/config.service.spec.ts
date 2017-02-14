/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InteruptsService } from './config.service';

describe('InteruptsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InteruptsService]
    });
  });

  it('should ...', inject([InteruptsService], (service: InteruptsService) => {
    expect(service).toBeTruthy();
  }));
});
