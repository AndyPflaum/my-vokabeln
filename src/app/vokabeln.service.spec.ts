import { TestBed } from '@angular/core/testing';

import { VokabelnService } from './vokabeln.service';

describe('VokabelnService', () => {
  let service: VokabelnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VokabelnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
