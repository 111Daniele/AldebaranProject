import { TestBed } from '@angular/core/testing';

import { MeteorsService } from './meteors.service';

describe('MeteorsService', () => {
  let service: MeteorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeteorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
