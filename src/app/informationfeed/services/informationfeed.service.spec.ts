import { TestBed } from '@angular/core/testing';

import { InformationfeedService } from './informationfeed.service';

describe('InformationfeedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InformationfeedService = TestBed.get(InformationfeedService);
    expect(service).toBeTruthy();
  });
});
