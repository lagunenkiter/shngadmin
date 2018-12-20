import { TestBed } from '@angular/core/testing';

import { SchedulersApiService } from './schedulers-api.service';

describe('SchedulersApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchedulersApiService = TestBed.get(SchedulersApiService);
    expect(service).toBeTruthy();
  });
});
