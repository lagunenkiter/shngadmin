import { TestBed } from '@angular/core/testing';

import { LogicsApiService } from './logics-api.service';

describe('LogicsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogicsApiService = TestBed.get(LogicsApiService);
    expect(service).toBeTruthy();
  });
});
